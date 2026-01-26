import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import ChatFab from "@/components/chat-fab";

const inter = Inter({ subsets: ["latin"] });

const siteUrl = "https://akileshjayakumar.com";

export const metadata: Metadata = {
  title: {
    default: "Akilesh Jayakumar | Portfolio",
    template: "%s | Akilesh Jayakumar",
  },
  description:
    "Building, exploring, and experimenting with GenAI & LLMs. AI Engineer with experience at Singapore government agencies.",
  keywords: [
    "Akilesh Jayakumar",
    "AI Engineer",
    "GenAI",
    "LLMs",
    "Portfolio",
    "Singapore",
    "Next.js",
    "Machine Learning",
  ],
  authors: [{ name: "Akilesh Jayakumar" }],
  creator: "Akilesh Jayakumar",
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Akilesh Jayakumar",
    title: "Akilesh Jayakumar | Portfolio",
    description:
      "Building, exploring, and experimenting with GenAI & LLMs. AI Engineer with experience at Singapore government agencies.",
    images: [
      {
        url: "/photo.png",
        width: 400,
        height: 400,
        alt: "Akilesh Jayakumar",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Akilesh Jayakumar | Portfolio",
    description:
      "Building, exploring, and experimenting with GenAI & LLMs. AI Engineer with experience at Singapore government agencies.",
    creator: "@sentrytoast",
    images: ["/photo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Akilesh Jayakumar",
  url: siteUrl,
  image: `${siteUrl}/photo.png`,
  jobTitle: "AI Engineer",
  worksFor: {
    "@type": "Organization",
    name: "Inland Revenue Authority of Singapore",
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "University of Wollongong",
  },
  sameAs: [
    "https://github.com/akileshjayakumar",
    "https://linkedin.com/in/akileshjayakumar",
    "https://x.com/sentrytoast",
    "https://medium.com/@akileshjayakumar",
  ],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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
