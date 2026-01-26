import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chat",
  description:
    "Chat with Akilesh Jayakumar's AI assistant. Ask about projects, experience, or anything else.",
  openGraph: {
    title: "Chat with Akilesh",
    description:
      "Chat with Akilesh Jayakumar's AI assistant. Ask about projects, experience, or anything else.",
    url: "https://akileshjayakumar.com/chat",
  },
  twitter: {
    title: "Chat with Akilesh",
    description:
      "Chat with Akilesh Jayakumar's AI assistant. Ask about projects, experience, or anything else.",
  },
};

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
