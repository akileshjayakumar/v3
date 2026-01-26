import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resume",
  description:
    "View Akilesh Jayakumar's resume and professional experience in AI Engineering.",
  openGraph: {
    title: "Resume - Akilesh Jayakumar",
    description:
      "View Akilesh Jayakumar's resume and professional experience in AI Engineering.",
    url: "https://akileshjayakumar.com/cv",
  },
  twitter: {
    title: "Resume - Akilesh Jayakumar",
    description:
      "View Akilesh Jayakumar's resume and professional experience in AI Engineering.",
  },
};

export default function CVLayout({ children }: { children: React.ReactNode }) {
  return children;
}
