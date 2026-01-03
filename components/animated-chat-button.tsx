"use client";

import React from "react";

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
      className={`relative group inline-flex items-center hover:text-gray-900 dark:hover:text-[#f2f1ec] transition-colors ${className}`}
      aria-label="Chat with me"
      title="Let's chat! Ask me anything about my work and experience"
    >
      <span className="relative z-10">{children}</span>
    </a>
  );
}
