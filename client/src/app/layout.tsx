import type { Metadata } from "next";
import { Reddit_Sans } from "next/font/google";
import "../styles/default.scss";
import LayoutFooter from "@/components/layout/footer/footer";
import LayoutHeader from "@/components/layout/header/header";
import LayoutMain from "@/components/layout/main/main";

const redditSans = Reddit_Sans({
  variable: "--font-reddit-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mood Tracking App",
  description: "Mood Tracking App, created by Huy Phan",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${redditSans.variable}`}>
        <LayoutHeader></LayoutHeader>
        <LayoutMain>{children}</LayoutMain>
        <LayoutFooter></LayoutFooter>
      </body>
    </html>
  );
}
