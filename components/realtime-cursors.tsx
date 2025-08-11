"use client";

import { useEffect, useMemo, useRef } from "react";
import * as Ably from "ably";

type CursorEvent = {
  t: "cursor";
  id: string;
  x: number; // 0..1
  y: number; // 0..1
  ts: number;
};

function readStableId(): string {
  try {
    const key = "cursor:id";
    let id = localStorage.getItem(key);
    if (!id) {
      id =
        globalThis.crypto?.randomUUID?.() ??
        Math.random().toString(36).slice(2);
      localStorage.setItem(key, id);
    }
    return id;
  } catch {
    return Math.random().toString(36).slice(2);
  }
}

function pickColorFromId(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++)
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  const h = hash % 360;
  return `hsl(${h} 70% 65%)`;
}

function nameFromId(id: string): string {
  const adjectives = [
    "Swift",
    "Calm",
    "Bright",
    "Brave",
    "Mellow",
    "Keen",
    "Gentle",
    "Quiet",
    "Neat",
    "Daring",
  ];
  const animals = [
    "Otter",
    "Falcon",
    "Panda",
    "Koala",
    "Tiger",
    "Dolphin",
    "Hawk",
    "Lynx",
    "Seal",
    "Fox",
  ];
  let hash = 0;
  for (let i = 0; i < id.length; i++)
    hash = (hash * 33 + id.charCodeAt(i)) >>> 0;
  const a = adjectives[hash % adjectives.length];
  const b = animals[(hash >>> 4) % animals.length];
  return `${a} ${b}`;
}

type RemoteCursor = {
  el: HTMLDivElement;
  x: number;
  y: number;
  tx: number;
  ty: number;
  last: number;
};

export default function RealtimeCursors(): null {
  const id = useMemo(readStableId, []);
  const color = useMemo(() => pickColorFromId(id), [id]);
  const layerRef = useRef<HTMLDivElement | null>(null);
  const cursorsRef = useRef<Map<string, RemoteCursor>>(new Map());
  const viewportRef = useRef({ w: 0, h: 0 });
  const bcRef = useRef<BroadcastChannel | null>(null);
  const rafRef = useRef(0);

  useEffect(() => {
    // Setup DOM layer and styles
    const layer = document.createElement("div");
    layer.style.position = "fixed";
    layer.style.left = "0";
    layer.style.top = "0";
    layer.style.width = "100vw";
    layer.style.height = "100vh";
    layer.style.pointerEvents = "none";
    layer.style.zIndex = "2147483646";
    document.body.appendChild(layer);
    layerRef.current = layer;

    const style = document.createElement("style");
    style.textContent = `.rtc{position:absolute;display:flex;align-items:center;gap:.4rem;transform:translate3d(0,0,0);will-change:transform}.rtc-badge{font:500 12px/1.2 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#fff;padding:.28rem .5rem;border-radius:.4rem;box-shadow:0 1px 2px rgba(0,0,0,.25)}`;
    document.head.appendChild(style);

    viewportRef.current = { w: window.innerWidth, h: window.innerHeight };
    const onResize = () => {
      viewportRef.current = { w: window.innerWidth, h: window.innerHeight };
    };
    window.addEventListener("resize", onResize, { passive: true });

    // Channel key for both Ably and local fallbacks
    const room = `cursors:${location.pathname}`;
    const hasBC = typeof BroadcastChannel !== "undefined";
    const bc = hasBC ? new BroadcastChannel(room) : null;
    bcRef.current = bc;

    // Try Ably if ABLY_API_KEY is configured on server
    let ablyRealtime: Ably.Realtime | null = null;
    let ablyChannel: Ably.RealtimeChannelCallbacks | null = null;
    async function initAbly() {
      try {
        const res = await fetch("/api/realtime-token", { method: "POST" });
        if (!res.ok) return; // not configured => skip
        const token = await res.json();
        ablyRealtime = new Ably.Realtime({ authUrl: "/api/realtime-token" });
        ablyChannel = ablyRealtime.channels.get(room);
        await new Promise<void>((resolve) =>
          ablyRealtime!.connection.once("connected", () => resolve())
        );
        ablyChannel.presence.enter({ id });
        ablyChannel.subscribe("cursor", (msg) => {
          const data = msg.data as CursorEvent;
          if (data?.id === id) return;
          handleMessageData(data);
        });
      } catch {
        // ignore; fall back to BroadcastChannel/localStorage
      }
    }
    initAbly();

    // Local "You" cursor so you always see something
    const selfEl = document.createElement("div");
    selfEl.className = "rtc";
    selfEl.innerHTML = `<svg width="14" height="20" viewBox="0 0 24 24" style="filter:drop-shadow(0 1px 1px rgba(0,0,0,.25))"><path fill="${color}" d="M2 2l18 8-7 3 3 7-8-18z"/></svg>`;
    const selfBadge = document.createElement("div");
    selfBadge.className = "rtc-badge";
    selfBadge.textContent = "You";
    selfBadge.style.background = color;
    selfEl.appendChild(selfBadge);
    layer.appendChild(selfEl);

    function ensureRemote(peerId: string): RemoteCursor | null {
      if (peerId === id) return null;
      const map = cursorsRef.current;
      let entry = map.get(peerId);
      if (!entry) {
        const el = document.createElement("div");
        el.className = "rtc";
        el.innerHTML = `<svg width="14" height="20" viewBox="0 0 24 24" style="filter:drop-shadow(0 1px 1px rgba(0,0,0,.25))"><path fill="${pickColorFromId(
          peerId
        )}" d="M2 2l18 8-7 3 3 7-8-18z"/></svg>`;
        const badge = document.createElement("div");
        badge.className = "rtc-badge";
        badge.textContent = nameFromId(peerId);
        badge.style.background = pickColorFromId(peerId);
        el.appendChild(badge);
        layer.appendChild(el);
        entry = {
          el,
          x: 0.5,
          y: 0.5,
          tx: 0.5,
          ty: 0.5,
          last: performance.now(),
        };
        map.set(peerId, entry);
      }
      return entry;
    }

    function handleMessageData(msg: CursorEvent | null) {
      if (!msg) return;
      if (!msg || msg.t !== "cursor" || msg.id === id) return;
      const entry = ensureRemote(msg.id);
      if (!entry) return;
      entry.tx = Math.max(0, Math.min(1, msg.x));
      entry.ty = Math.max(0, Math.min(1, msg.y));
      entry.last = performance.now();
    }
    function handleMessage(ev: MessageEvent<CursorEvent>) {
      handleMessageData(ev.data);
    }
    if (bc) bc.addEventListener("message", handleMessage);
    function onStorage(ev: StorageEvent) {
      if (ev.key !== room || !ev.newValue) return;
      try {
        handleMessageData(JSON.parse(ev.newValue) as CursorEvent);
      } catch {}
    }
    window.addEventListener("storage", onStorage);

    let lastSent = 0;
    function onPointerMove(e: PointerEvent) {
      const now = performance.now();
      if (now - lastSent < 16) return; // ~60Hz
      lastSent = now;
      const { w, h } = viewportRef.current;
      const x = Math.max(0, Math.min(1, e.clientX / w));
      const y = Math.max(0, Math.min(1, e.clientY / h));
      // update local cursor position immediately
      const px = Math.round(x * w);
      const py = Math.round(y * h);
      selfEl.style.transform = `translate3d(${px}px, ${py}px, 0)`;
      const payload: CursorEvent = { t: "cursor", id, x, y, ts: Date.now() };
      if (ablyChannel) {
        ablyChannel.publish("cursor", payload);
      } else if (bc) bc.postMessage(payload);
      else {
        try {
          localStorage.setItem(room, JSON.stringify(payload));
        } catch {}
      }
    }
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    function frame() {
      const t = 0.2;
      const { w, h } = viewportRef.current;
      for (const entry of cursorsRef.current.values()) {
        entry.x += (entry.tx - entry.x) * t;
        entry.y += (entry.ty - entry.y) * t;
        const px = Math.round(entry.x * w);
        const py = Math.round(entry.y * h);
        entry.el.style.transform = `translate3d(${px}px, ${py}px, 0)`;
        const idle = performance.now() - entry.last > 30_000;
        entry.el.style.display = idle ? "none" : "flex";
      }
      rafRef.current = requestAnimationFrame(frame);
    }
    rafRef.current = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", onResize);
      if (ablyChannel) {
        try {
          ablyChannel.unsubscribe();
          ablyChannel.presence.leave();
        } catch {}
      }
      if (ablyRealtime) {
        try {
          ablyRealtime.close();
        } catch {}
      }
      if (bc) {
        bc.removeEventListener("message", handleMessage);
        bc.close();
      }
      window.removeEventListener("storage", onStorage);
      style.remove();
      cursorsRef.current.forEach((c) => c.el.remove());
      cursorsRef.current.clear();
      selfEl.remove();
      layer.remove();
    };
  }, [id, color]);

  return null;
}
