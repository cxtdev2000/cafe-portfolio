import type { Metadata } from "next";
import { Be_Vietnam_Pro, Fraunces } from "next/font/google";
import { profile } from "@/content/portfolio";
import { TrafficTracker } from "@/components/analytics/traffic-tracker";
import "./globals.css";

const bodyFont = Be_Vietnam_Pro({
  variable: "--font-be-vietnam",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600"],
});

const displayFont = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin", "vietnamese"],
});

export const metadata: Metadata = {
  title: `${profile.cafeName} — ${profile.name}`,
  description: `Portfolio 3D của ${profile.name}: giới thiệu, dự án và liên hệ trong một quán cà phê nhỏ.`,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi" className={`${bodyFont.variable} ${displayFont.variable} h-full antialiased`}>
      <body className="min-h-full">
        <TrafficTracker />
        {children}
      </body>
    </html>
  );
}
