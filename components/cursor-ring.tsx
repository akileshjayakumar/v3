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
    if (mode !== "ring" || reduceMotion) return;

    // Hide native cursor and create ring element
    prevCursorRef.current = document.body.style.cursor;
    document.body.style.cursor = "none";

    const ring = document.createElement("div");
    ring.setAttribute("aria-hidden", "true");
    ring.style.position = "fixed";
    ring.style.left = "0";
    ring.style.top = "0";
    ring.style.zIndex = "2147483645";
    ring.style.width = "20px";
    ring.style.height = "20px";
    ring.style.border = "3px solid rgba(0,0,0,0.85)";
    ring.style.borderRadius = "9999px";
    ring.style.boxShadow = "0 0 0 2px rgba(255,255,255,0.9) inset";
    ring.style.pointerEvents = "none";
    ring.style.transform = "translate3d(-100px, -100px, 0)";
    ring.style.transition = "border-color 120ms ease";
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
      targetRef.current.s = isInteractive(el) ? 1.6 : 1;
      ring.style.borderColor = isInteractive(el)
        ? "rgba(0,0,0,0.9)"
        : "rgba(0,0,0,0.85)";
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
      ring.style.transform = `translate3d(${stateRef.current.x - 10}px, ${
        stateRef.current.y - 10
      }px, 0) scale(${s})`;
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
