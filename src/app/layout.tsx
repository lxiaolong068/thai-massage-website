import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Victoria's Outcall Massage | Professional Thai Massage in Bangkok",
  description: "Experience premium Thai massage services in Bangkok. Our professional therapists bring relaxation and rejuvenation to your doorstep with personalized massage therapy.",
  keywords: ["Thai massage", "Bangkok massage", "outcall massage", "professional massage", "relaxation therapy", "Thai therapists"],
  authors: [{ name: "Victoria's Bangkok" }],
  openGraph: {
    title: "The Victoria's Outcall Massage | Professional Thai Massage in Bangkok",
    description: "Experience premium Thai massage services in Bangkok. Our professional therapists bring relaxation and rejuvenation to your doorstep.",
    url: "https://victorias-bangkok.com",
    siteName: "The Victoria's Outcall Massage",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 根布局只负责传递子组件，不添加任何额外的HTML结构
  // HTML和body标签将由[locale]布局添加
  return children;
}
