"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";

/**
 * Floating "Chat with me" bubble shown on mobile/tablet only.
 * - Appears when user scrolls (and when scrolled past a small threshold)
 * - Hidden on desktop (lg and up)
 * - Hidden on the `/chat` page to avoid redundancy
 */
export default function ChatFab(): JSX.Element | null {
  const pathname = usePathname();
  const [visible, setVisible] = React.useState(false);

  // Hide on the chat page
  if (pathname === "/chat") return null;

  React.useEffect(() => {
    let hideTimer: ReturnType<typeof setTimeout> | undefined;

    const onScroll = () => {
      // Show when user scrolls, also keep visible if scrolled beyond threshold
      const overThreshold = window.scrollY > 80;
      setVisible(true);

      // Auto-hide after inactivity, but keep if over threshold
      if (hideTimer) clearTimeout(hideTimer);
      hideTimer = setTimeout(() => setVisible(overThreshold), 1800);
    };

    // Initial state if already scrolled
    if (typeof window !== "undefined" && window.scrollY > 80) setVisible(true);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (hideTimer) clearTimeout(hideTimer);
    };
  }, []);

  return (
    <div
      className={
        // Mobile/tablet only; fixed to bottom-right; fade/slide in
        `lg:hidden fixed right-4 bottom-4 z-40 transition-all duration-300 ` +
        (visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-2 pointer-events-none")
      }
    >
      <a
        href="/chat"
        aria-label="Chat with me"
        className="flex items-center gap-2 rounded-full bg-blue-600 text-white px-4 py-3 shadow-lg shadow-blue-600/20 hover:bg-blue-700 active:scale-[0.98]"
      >
        <MessageCircle className="h-5 w-5" />
        <span className="text-sm font-medium">Chat with me</span>
      </a>
    </div>
  );
}
