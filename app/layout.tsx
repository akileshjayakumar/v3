import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import CursorRing from "@/components/cursor-ring";
import ChatFab from "@/components/chat-fab";

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
          {/* Custom black ring cursor */}
          <CursorRing />
          {/* Floating chat bubble (mobile/tablet only) */}
          <ChatFab />
        </ThemeProvider>
      </body>
    </html>
  );
}
