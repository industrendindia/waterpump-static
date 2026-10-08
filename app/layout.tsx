import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GJVN | Integrated Water & Engineering Solutions",
  description:
    "Engineered pump systems, treatment, metering and digital water solutions for industry and infrastructure.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
