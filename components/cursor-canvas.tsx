"use client";

import { useEffect, useRef } from "react";

/**
 * CursorCanvas renders a DPR-aware canvas follower.
 * Enables when document.body.dataset.cursorMode === "canvas".
 * Optional auto-contrast based on background luminance using getImageData.
 */
export default function CursorCanvas(): null {
  const rafRef = useRef<number>(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const prevCursorRef = useRef<string | null>(null);
  const posRef = useRef({ x: -100, y: -100, t: 0 });

  useEffect(() => {
    const mode = document.body.dataset.cursorMode;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (mode !== "canvas" || reduceMotion) return;

    prevCursorRef.current = document.body.style.cursor;
    document.body.style.cursor = "none";

    const canvas = document.createElement("canvas");
    canvas.style.position = "fixed";
    canvas.style.inset = "0";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "2147483644";
    document.body.appendChild(canvas);
    canvasRef.current = canvas;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;
    ctxRef.current = ctx;

    const setup = () => {
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      const w = Math.floor(window.innerWidth * dpr);
      const h = Math.floor(window.innerHeight * dpr);
      canvas.width = w;
      canvas.height = h;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    setup();
    window.addEventListener("resize", setup);

    const onMove = (e: PointerEvent) => {
      posRef.current.x = e.clientX;
      posRef.current.y = e.clientY;
      posRef.current.t = performance.now();
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const draw = () => {
      const ctx2 = ctxRef.current!;
      ctx2.clearRect(0, 0, canvas.width, canvas.height);
      const x = posRef.current.x;
      const y = posRef.current.y;
      const show = performance.now() - posRef.current.t < 3000;
      if (show) {
        const sample = ctx2.getImageData(
          Math.max(0, x - 1),
          Math.max(0, y - 1),
          1,
          1
        ).data;
        const luminance =
          (0.2126 * sample[0] + 0.7152 * sample[1] + 0.0722 * sample[2]) / 255;
        const fg = luminance > 0.6 ? "#000" : "#fff"; // auto-contrast
        ctx2.save();
        ctx2.lineWidth = 4;
        ctx2.strokeStyle = fg;
        ctx2.globalAlpha = 0.9;
        ctx2.beginPath();
        ctx2.arc(x, y, 10, 0, Math.PI * 2);
        ctx2.stroke();
        ctx2.globalAlpha = 0.15;
        ctx2.fillStyle = fg;
        ctx2.beginPath();
        ctx2.arc(x, y, 18, 0, Math.PI * 2);
        ctx2.fill();
        ctx2.restore();
      }
      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", setup);
      if (canvasRef.current) canvasRef.current.remove();
      if (prevCursorRef.current !== null) {
        document.body.style.cursor = prevCursorRef.current;
        prevCursorRef.current = null;
      }
    };
  }, []);

  return null;
}
