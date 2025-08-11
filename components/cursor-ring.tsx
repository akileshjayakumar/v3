"use client";

import { useEffect, useRef } from "react";

/**
 * CursorRing renders a single DOM ring that follows the pointer.
 * It activates only when document.body.dataset.cursorMode === "ring".
 * Respects prefers-reduced-motion and restores the system cursor on cleanup.
 */
export default function CursorRing(): null {
  const rafRef = useRef<number>(0);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const targetRef = useRef({ x: 0, y: 0, s: 1 });
  const stateRef = useRef({ x: 0, y: 0, s: 1 });
  const prevCursorRef = useRef<string | null>(null);

  useEffect(() => {
    const mode = document.body.dataset.cursorMode;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    // Disable on mobile/tablet (touch/coarse pointers or mobile UA)
    const isTouchOrCoarse =
      navigator.maxTouchPoints > 0 ||
      window.matchMedia("(pointer: coarse)").matches ||
      window.matchMedia("(hover: none)").matches;
    const isMobileUa = /Mobi|Android|iPad|iPhone|iPod/i.test(
      navigator.userAgent
    );
    if (mode !== "ring" || reduceMotion || isTouchOrCoarse || isMobileUa) {
      return;
    }

    // Hide native cursor and create ring element
    prevCursorRef.current = document.body.style.cursor;
    document.body.style.cursor = "none";

    const ring = document.createElement("div");
    ring.setAttribute("aria-hidden", "true");
    ring.style.position = "fixed";
    ring.style.left = "0";
    ring.style.top = "0";
    ring.style.zIndex = "2147483645";
    const baseSizePx = 24; // slightly larger base size
    const baseHalfPx = baseSizePx / 2;
    ring.style.width = `${baseSizePx}px`;
    ring.style.height = `${baseSizePx}px`;
    ring.style.border = "4px solid rgba(0,0,0,0.9)"; // thicker, darker border
    ring.style.borderRadius = "9999px";
    ring.style.boxShadow = "0 0 0 2px rgba(255,255,255,0.9) inset";
    ring.style.pointerEvents = "none";
    ring.style.transform = "translate3d(-100px, -100px, 0)";
    ring.style.transition = "border-color 120ms ease";
    ring.style.transformOrigin = "center center";
    document.body.appendChild(ring);
    ringRef.current = ring;

    const isInteractive = (el: Element | null): boolean => {
      return !!el?.closest(
        "a, button, [role='button'], input, textarea, select, summary, label, [data-cursor-interactive='true']"
      );
    };

    let lastTs = 0;
    const onPointerMove = (e: PointerEvent) => {
      lastTs = e.timeStamp || performance.now();
      targetRef.current.x = e.clientX;
      targetRef.current.y = e.clientY;
      const el = document.elementFromPoint(e.clientX, e.clientY);
      targetRef.current.s = isInteractive(el) ? 1.9 : 1; // larger growth on interactive
      ring.style.borderColor = isInteractive(el)
        ? "rgba(0,0,0,1)"
        : "rgba(0,0,0,0.9)";
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    const onBlur = () => {
      ring.style.opacity = "0";
    };
    const onFocus = () => {
      ring.style.opacity = "1";
    };
    window.addEventListener("blur", onBlur);
    window.addEventListener("focus", onFocus);

    const tick = () => {
      const t = 0.22; // smoothing factor
      stateRef.current.x += (targetRef.current.x - stateRef.current.x) * t;
      stateRef.current.y += (targetRef.current.y - stateRef.current.y) * t;
      stateRef.current.s += (targetRef.current.s - stateRef.current.s) * t;
      const s = stateRef.current.s;
      ring.style.transform = `translate3d(${
        stateRef.current.x - baseHalfPx
      }px, ${stateRef.current.y - baseHalfPx}px, 0) scale(${s})`;
      // auto-hide when idle
      const idle = performance.now() - lastTs > 3000;
      ring.style.display = idle ? "none" : "block";
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("focus", onFocus);
      if (ringRef.current) {
        ringRef.current.remove();
        ringRef.current = null;
      }
      if (prevCursorRef.current !== null) {
        document.body.style.cursor = prevCursorRef.current;
        prevCursorRef.current = null;
      }
    };
  }, []);

  return null;
}
