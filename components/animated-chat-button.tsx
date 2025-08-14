"use client";

import React from "react";
import { MessageCircle } from "lucide-react";

interface AnimatedChatButtonProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export default function AnimatedChatButton({
  href,
  children,
  className = "",
}: AnimatedChatButtonProps) {
  return (
    <a
      href={href}
      className={`relative group inline-flex items-center ${className}`}
      aria-label="Chat with me"
      title="Let's chat! Ask me anything about my work and experience"
    >
      {/* Main button content */}
      <span className="relative z-10">{children}</span>

      {/* Animated background pulse - only on desktop */}
      <span className="absolute inset-0 rounded-md bg-blue-500/20 animate-pulse hidden sm:block" />

      {/* Subtle glow effect on hover */}
      <span className="absolute inset-0 rounded-md bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Animated border on hover */}
      <span className="absolute inset-0 rounded-md border-2 border-transparent group-hover:border-blue-500/30 transition-colors duration-300" />

      {/* Tooltip for desktop */}
      <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none hidden sm:block whitespace-nowrap">
        chat with me!
        <span className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></span>
      </span>
    </a>
  );
}
