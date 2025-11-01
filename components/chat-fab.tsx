"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";

/**
 * Minimal floating chat button shown on mobile/tablet only.
 * - Icon-only design, semi-transparent when idle
 * - Appears when scrolling, fades to subtle opacity after inactivity
 * - Moves above footer to avoid blocking content
 * - Hidden on desktop (md and up) and `/chat` page - only visible on mobile devices
 */
export default function ChatFab(): JSX.Element | null {
  const pathname = usePathname();
  const [visible, setVisible] = React.useState(false);
  const [isActive, setIsActive] = React.useState(false);
  const [nearFooter, setNearFooter] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);

  // Hide on the chat page
  if (pathname === "/chat") return null;

  // Check if device is mobile/tablet (screen width < 768px)
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  React.useEffect(() => {
    let hideTimer: ReturnType<typeof setTimeout> | undefined;

    const onScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Show when user scrolls past threshold
      const overThreshold = scrollY > 100;
      setVisible(overThreshold);
      
      // Check if near footer (within 200px from bottom)
      const distanceFromBottom = documentHeight - (scrollY + windowHeight);
      setNearFooter(distanceFromBottom < 200);

      // Show active state while scrolling
      setIsActive(true);
      
      // Fade to subtle after inactivity
      if (hideTimer) clearTimeout(hideTimer);
      hideTimer = setTimeout(() => setIsActive(false), 2000);
    };

    // Initial state
    if (typeof window !== "undefined") {
      onScroll();
    }
    
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (hideTimer) clearTimeout(hideTimer);
    };
  }, []);

  // Only render on mobile/tablet devices
  if (!isMobile) return null;

  return (
    <div
      className={
        `md:hidden fixed right-4 z-40 transition-all duration-500 ease-out ` +
        // Move up when near footer
        (nearFooter ? "bottom-[220px]" : "bottom-6") + " " +
        // Fade in/out based on scroll
        (visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4 pointer-events-none")
      }
    >
      <a
        href="/chat"
        aria-label="Chat with me"
        className={
          "group flex items-center justify-center rounded-full bg-blue-600/90 text-white shadow-md " +
          "hover:bg-blue-600 hover:shadow-lg active:scale-95 " +
          "backdrop-blur-sm border border-blue-400/20 " +
          "transition-all duration-300 " +
          // Smaller, more subtle size - icon only
          "w-12 h-12 " +
          // Subtle opacity when idle, full when active/hover
          (isActive ? "opacity-100" : "opacity-60")
        }
      >
        <MessageCircle className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
      </a>
    </div>
  );
}
