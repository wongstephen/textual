import "./globals.css";

import type { Metadata } from "next";
import { Roboto } from "next/font/google";

import cn from "@/utils/cn";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Textual",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn([roboto.variable])}>{children}</body>
    </html>
  );
}
