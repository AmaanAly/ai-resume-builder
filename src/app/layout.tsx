import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: "ResumeAI — Build Your Perfect Resume with AI",
  description: "Create a professional, ATS-optimized resume in minutes using AI. Free, fast, and available 24/7.",
  keywords: "AI resume builder, resume generator, ATS resume, professional resume, CV builder",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ position: 'relative' }}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
