"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as Ably from "ably";

/**
 * Cursor event type for realtime cursor sharing.
 */
type CursorEvent = {
  t: "cursor" | "click" | "leave";
  id: string;
  x: number; // 0..1
  y: number; // 0..1
  ts: number;
  name?: string;
  color?: string;
};

/**
 * Returns a stable, per-browser unique ID for the user.
 */
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

/**
 * Returns a per-session random color, persisted in sessionStorage.
 */
function getSessionColor(): string {
  try {
    const key = "cursor:color";
    let c = sessionStorage.getItem(key);
    if (!c) {
      const h = Math.floor(Math.random() * 360);
      const s = 70 + Math.floor(Math.random() * 20) - 10; // 60-80
      const l = 55 + Math.floor(Math.random() * 20) - 10; // 45-65
      c = `hsl(${h} ${Math.max(50, Math.min(90, s))}% ${Math.max(
        35,
        Math.min(75, l)
      )}%)`;
      sessionStorage.setItem(key, c);
    }
    return c;
  } catch {
    const h = Math.floor(Math.random() * 360);
    return `hsl(${h} 70% 60%)`;
  }
}

// Ensure white text remains legible by forcing a darker, saturated badge background
function toContrastyBadgeBg(hslColor: string): string {
  try {
    const m = /hsl\(\s*(\d{1,3})\s+([\d.]+)%\s+([\d.]+)%\s*\)/i.exec(hslColor);
    if (!m) return "hsl(220 70% 30%)"; // safe fallback
    const h = Math.max(0, Math.min(360, parseFloat(m[1])));
    const sIn = Math.max(0, Math.min(100, parseFloat(m[2])));
    const lIn = Math.max(0, Math.min(100, parseFloat(m[3])));
    const s = Math.max(60, sIn);
    const l = lIn > 55 ? 35 : Math.max(25, lIn);
    return `hsl(${h} ${s}% ${l}%)`;
  } catch {
    return "hsl(220 70% 30%)";
  }
}
async function getSessionName(): Promise<string> {
  try {
    // Always request a fresh nickname per page load
    const response = await fetch("/api/genai-nickname", {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) throw new Error("Failed to fetch nickname from backend");

    const data = await response.json();
    // The backend should return { nickname: "Brave Otter" }
    const n = typeof data.nickname === "string" ? data.nickname.trim() : "";
    return n; // may be empty string if API errored or returned nothing
  } catch (err) {
    // Strict: do not synthesize non-AI names
    return "";
  }
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
  // id and color are always strings, but name is a Promise<string>
  const id = useMemo(readStableId, []);
  const color = useMemo(getSessionColor, []);
  // name is async, so we need to handle it with state
  const nameRef = useRef<string>("");

  // We use a ref to trigger a re-render when the name is loaded
  // Import useState at the top of your file: import { useState, useRef, useEffect, useMemo } from "react";
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    let mounted = true;
    getSessionName().then((n) => {
      if (mounted) {
        nameRef.current = n;
        // Update on-screen badge immediately
        try {
          if (selfBadgeRef.current) {
            selfBadgeRef.current.textContent = n;
          }
        } catch {}
        // Push presence update so peers refresh label/color
        try {
          const { ch } = ablyRefs.current;
          if (ch) ch.presence.update({ id, name: n, color });
        } catch {}
        forceUpdate((x: number) => x + 1); // Explicitly type 'x' as number to fix the lint error
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const layerRef = useRef<HTMLDivElement | null>(null);
  const cursorsRef = useRef<Map<string, RemoteCursor>>(new Map());
  const viewportRef = useRef({ w: 0, h: 0 });
  const bcRef = useRef<BroadcastChannel | null>(null);
  const rafRef = useRef(0);
  const prevCursorCssRef = useRef<string | null>(null);
  const lastFrameTsRef = useRef<number>(performance.now());
  const selfBadgeRef = useRef<HTMLDivElement | null>(null);
  const ablyRefs = useRef<{ rt: any | null; ch: any | null }>({
    rt: null,
    ch: null,
  });
  const CURSOR_SIZE = 40;
  const CURSOR_HALF = CURSOR_SIZE / 2;

  useEffect(() => {
    // Disable on mobile/touch devices and small viewports
    const isTouchOrCoarsePointer =
      window.matchMedia("(pointer: coarse)").matches ||
      window.matchMedia("(hover: none)").matches;
    const isSmallViewport = window.matchMedia("(max-width: 767px)").matches;
    if (isTouchOrCoarsePointer || isSmallViewport) {
      return;
    }

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

    // We render our own cursor and hide the system cursor

    const style = document.createElement("style");
    style.textContent = `
      html, body, * { cursor: none !important; }
      .rtc{position:absolute;display:flex;align-items:center;gap:.5rem;transform:translate3d(0,0,0);will-change:transform}
      .rtc-badge{font:700 14px/1.2 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#fff;padding:.3rem .55rem;border-radius:.45rem;box-shadow:0 2px 6px rgba(0,0,0,.18);transform: translate(10px, -12px)}
      .rtc-click{position:absolute;pointer-events:none;border-radius:9999px;box-shadow:0 0 0 2px rgba(255,255,255,.9) inset}
      @keyframes rtc-ripple{from{opacity:.9;transform:scale(.2)}to{opacity:0;transform:scale(2.4)}}
    `;
    document.head.appendChild(style);

    viewportRef.current = { w: window.innerWidth, h: window.innerHeight };
    const onResize = () => {
      viewportRef.current = { w: window.innerWidth, h: window.innerHeight };
    };
    window.addEventListener("resize", onResize, { passive: true });

    // Hide OS cursor (belt-and-suspenders in addition to CSS rule)
    prevCursorCssRef.current = document.body.style.cursor;
    document.body.style.cursor = "none";

    // Channel key for both Ably and local fallbacks
    const room = `cursors:${location.pathname}`;
    const hasBC = typeof BroadcastChannel !== "undefined";
    const bc = hasBC ? new BroadcastChannel(room) : null;
    bcRef.current = bc;

    // Try Ably if ABLY_API_KEY is configured on server
    let ablyRealtime: any = null; // Use 'any' to avoid TypeScript errors if types are missing
    let ablyChannel: any = null; // Use 'any' for the same reason
    async function initAbly() {
      try {
        // Quick capability check to avoid spamming 503
        const probe = await fetch("/api/realtime-token", { method: "GET" });
        const probeJson = await probe.json().catch(() => ({ enabled: false }));
        if (!probe.ok || !probeJson?.enabled) return; // not configured => skip
        ablyRealtime = new Ably.Realtime({ authUrl: "/api/realtime-token" });
        ablyChannel = ablyRealtime.channels.get(room);
        await new Promise<void>((resolve) =>
          ablyRealtime!.connection.once("connected", () => resolve())
        );
        ablyChannel.presence.enter({ id, name: nameRef.current, color });
        // cleanup remote cursors on leave
        ablyChannel.presence.subscribe("leave", (m: any) => {
          // Try to get the peer's ID from either clientId or data.id
          const peerId =
            (m && typeof m.clientId === "string" && m.clientId) ||
            (m && m.data && (m.data as any).id);
          if (!peerId) return;
          const entry = cursorsRef.current.get(peerId);
          if (entry) {
            entry.el.remove();
            cursorsRef.current.delete(peerId);
          }
        });
        ablyChannel.subscribe("cursor", (msg: any) => {
          const data = msg.data as CursorEvent;
          if (data?.id === id) return;
          handleMessageData(data);
        });
        ablyRefs.current = { rt: ablyRealtime, ch: ablyChannel };
      } catch {
        // ignore; fall back to BroadcastChannel/localStorage
      }
    }
    initAbly();

    // Local big triangle cursor + small badge
    const selfEl = document.createElement("div");
    selfEl.className = "rtc";
    // Transparent ring with thick black border
    selfEl.innerHTML = `
      <svg width="40" height="40" viewBox="0 0 40 40" style="filter:drop-shadow(0 2px 6px rgba(0,0,0,.15))">
        <circle cx="20" cy="20" r="12" fill="none" stroke="#111" stroke-width="6"/>
      </svg>`;
    const selfBadge = document.createElement("div");
    selfBadge.className = "rtc-badge";
    selfBadge.textContent = nameRef.current || "…";
    selfBadge.style.background = toContrastyBadgeBg(color as string);
    selfBadgeRef.current = selfBadge;
    selfEl.appendChild(selfBadge);
    layer.appendChild(selfEl);

    function ensureRemote(peerId: string): RemoteCursor | null {
      if (peerId === id) return null;
      const map = cursorsRef.current;
      let entry = map.get(peerId);
      if (!entry) {
        const el = document.createElement("div");
        el.className = "rtc";
        const peerColor = msgColorCache.get(peerId) || getSessionColor();
        // Remote peers render same big triangle style
        el.innerHTML = `
          <svg width="40" height="40" viewBox="0 0 40 40" style="filter:drop-shadow(0 2px 6px rgba(0,0,0,.15))">
            <circle cx="20" cy="20" r="12" fill="none" stroke="#111" stroke-width="6"/>
          </svg>`;
        const badge = document.createElement("div");
        badge.className = "rtc-badge";
        const displayName = msgNameCache.get(peerId) || "…";
        badge.textContent = displayName;
        badge.style.background = toContrastyBadgeBg(peerColor);
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

    function showClickRipple(
      xNorm: number,
      yNorm: number,
      colorForPeer: string
    ) {
      const { w, h } = viewportRef.current;
      const px = Math.round(xNorm * w);
      const py = Math.round(yNorm * h);
      const ripple = document.createElement("div");
      ripple.className = "rtc-click";
      ripple.style.left = `${px - 10}px`;
      ripple.style.top = `${py - 10}px`;
      ripple.style.width = `20px`;
      ripple.style.height = `20px`;
      ripple.style.background = colorForPeer;
      ripple.style.opacity = "0.15";
      ripple.style.animation = "rtc-ripple 500ms ease-out forwards";
      layer.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    }

    const msgNameCache = new Map<string, string>();
    const msgColorCache = new Map<string, string>();

    function handleMessageData(msg: CursorEvent | null) {
      if (!msg) return;
      if (msg.id === id) return;
      if (msg.name) msgNameCache.set(msg.id, msg.name);
      if (msg.color) msgColorCache.set(msg.id, msg.color);
      if (msg.t === "cursor") {
        const entry = ensureRemote(msg.id);
        if (!entry) return;
        entry.tx = Math.max(0, Math.min(1, msg.x));
        entry.ty = Math.max(0, Math.min(1, msg.y));
        entry.last = performance.now();
      } else if (msg.t === "click") {
        showClickRipple(
          Math.max(0, Math.min(1, msg.x)),
          Math.max(0, Math.min(1, msg.y)),
          msg.color || getSessionColor()
        );
      } else if (msg.t === "leave") {
        const entry = cursorsRef.current.get(msg.id);
        if (entry) {
          entry.el.remove();
          cursorsRef.current.delete(msg.id);
        }
      }
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
    let lastX = 0;
    let lastY = 0;
    function onPointerMove(e: PointerEvent) {
      const now = performance.now();
      // Rate-limit to ~60Hz and ignore tiny movements
      if (now - lastSent < 16) return;
      lastSent = now;
      const { w, h } = viewportRef.current;
      const x = Math.max(0, Math.min(1, e.clientX / w));
      const y = Math.max(0, Math.min(1, e.clientY / h));
      if (Math.abs(x - lastX) < 0.0005 && Math.abs(y - lastY) < 0.0005) return;
      lastX = x;
      lastY = y;
      // update local cursor position immediately
      const px = x * w;
      const py = y * h;
      selfEl.style.transform = `translate3d(${px - CURSOR_HALF}px, ${
        py - CURSOR_HALF
      }px, 0)`;
      const payload: CursorEvent = {
        t: "cursor",
        id,
        x,
        y,
        ts: Date.now(),
        name: nameRef.current || "",
        color: typeof color === "string" ? color : "",
      };
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

    function onPointerDown(e: PointerEvent) {
      const { w, h } = viewportRef.current;
      const x = Math.max(0, Math.min(1, e.clientX / w));
      const y = Math.max(0, Math.min(1, e.clientY / h));
      // local ripple
      showClickRipple(x, y, color);
      const payload: CursorEvent = {
        t: "click",
        id,
        x,
        y,
        ts: Date.now(),
        name: nameRef.current || "",
        color: typeof color === "string" ? color : "",
      };
      if (ablyChannel) {
        ablyChannel.publish("cursor", payload);
      } else if (bc) bc.postMessage(payload);
      else {
        try {
          localStorage.setItem(room, JSON.stringify(payload));
        } catch {}
      }
    }
    window.addEventListener("pointerdown", onPointerDown, { passive: true });

    function frame() {
      const now = performance.now();
      const dt = Math.max(0.001, now - lastFrameTsRef.current || 16);
      lastFrameTsRef.current = now;
      const tau = 90; // ms time constant for smoothing
      const alpha = 1 - Math.exp(-dt / tau);
      const { w, h } = viewportRef.current;
      for (const entry of cursorsRef.current.values()) {
        entry.x += (entry.tx - entry.x) * alpha;
        entry.y += (entry.ty - entry.y) * alpha;
        const px = entry.x * w;
        const py = entry.y * h;
        entry.el.style.transform = `translate3d(${px - CURSOR_HALF}px, ${
          py - CURSOR_HALF
        }px, 0)`;
        const idle = performance.now() - entry.last > 30_000;
        entry.el.style.display = idle ? "none" : "flex";
      }
      rafRef.current = requestAnimationFrame(frame);
    }
    rafRef.current = requestAnimationFrame(frame);

    const onBeforeUnload = () => {
      const payload: CursorEvent = {
        t: "leave",
        id,
        x: 0,
        y: 0,
        ts: Date.now(),
        name: nameRef.current || "",
        color: typeof color === "string" ? color : "",
      };
      const { ch } = ablyRefs.current;
      try {
        if (ch) ch.publish("cursor", payload);
        else if (bc) bc.postMessage(payload);
        else localStorage.setItem(room, JSON.stringify(payload));
      } catch {}
    };
    window.addEventListener("pagehide", onBeforeUnload);
    window.addEventListener("beforeunload", onBeforeUnload);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pagehide", onBeforeUnload);
      window.removeEventListener("beforeunload", onBeforeUnload);
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
      // restore system cursor if we hid it
      if (prevCursorCssRef.current !== null) {
        document.body.style.cursor = prevCursorCssRef.current;
        prevCursorCssRef.current = null;
      }
    };
  }, [id, color]);

  return null;
}
