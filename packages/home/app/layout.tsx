import "./globals.css";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { PropsWithChildren } from "react";

import Navigation from "./components/Navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

const pages = [
  { href: "/", name: "Index" },
  { href: "/page-one", name: "One" },
  { href: "/page-two", name: "Two" },
  { href: "/page-three", name: "Three" },
];

interface IProps {}

export default function RootLayout(props: PropsWithChildren<IProps>) {
  const { children } = props;
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="h-screen w-screen overflow-hidden">
          <Navigation pages={pages} />
          {children}
        </div>
      </body>
    </html>
  );
}
