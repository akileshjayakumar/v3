"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-8 h-8" />; // Placeholder to avoid layout shift
  }

  return (
    <button
      id="theme-toggle"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="w-8 h-8 flex items-center justify-center text-gray-900 dark:text-[#f2f1ec] transition-all hover:opacity-70 active:scale-95"
      aria-label="Change color scheme"
    >
      <div className="relative w-6 h-6 flex items-center justify-center">
        <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </div>
    </button>
  );
}
