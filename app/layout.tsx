import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import RealtimeCursors from "@/components/realtime-cursors";
import CursorRing from "@/components/cursor-ring";
import CursorCanvas from "@/components/cursor-canvas";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Akilesh Jayakumar",
  description: "Portfolio Website of Akilesh Jayakumar",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className} data-cursor-mode="ring">
        <ThemeProvider
          attribute="class"
          forcedTheme="light"
          disableTransitionOnChange
        >
          {children}
          {/* Realtime shared cursors layer */}
          <RealtimeCursors />
          {/* Optional local cursor followers (activate by setting body.dataset.cursorMode) */}
          <CursorRing />
          <CursorCanvas />
        </ThemeProvider>
      </body>
    </html>
  );
}
