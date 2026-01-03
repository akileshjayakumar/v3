import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import ChatFab from "@/components/chat-fab";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Portfolio | Akilesh Jayakumar",
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
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link rel="dns-prefetch" href="https://groq.com" />
        <link rel="dns-prefetch" href="https://tailwindcss.com" />
        <link rel="dns-prefetch" href="https://www.google.com" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          {/* Floating chat bubble (mobile/tablet only) */}
          <ChatFab />
        </ThemeProvider>
      </body>
    </html>
  );
}
