"use client";

import * as React from "react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <button
      id="theme-toggle"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="w-8 h-8 flex items-center justify-center text-gray-900 dark:text-[#f2f1ec] transition-colors hover:opacity-70"
      aria-label="Change color scheme"
    >
      <svg
        className="w-4 h-4 fill-current"
        viewBox="0 0 16 16"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="8" cy="8" r="8" />
      </svg>
    </button>
  );
}

