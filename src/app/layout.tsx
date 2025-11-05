'use client';

import { Geist, Geist_Mono } from "next/font/google";
import React from "react";
import "./globals.css";
import ReactQueryProvider from "@/lib/react-query-provider";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function RootLayout({ children }: { children: React.ReactNode }) {

  return (
    <html suppressHydrationWarning lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex bg-transparent`}>
        <ReactQueryProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
          </ThemeProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
