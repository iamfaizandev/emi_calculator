import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EMI Calculator | Md Faizan Ahmad",
  description:
    "Calculate your EMI for products, home loans, and car loans with ease.",
  keywords: ["EMI calculator", "loan calculator", "finance tool"],
  openGraph: {
    title: "EMI Calculator",
    description: "Calculate your EMI with our user-friendly tool.",
    url: "https://your-domain.com",
    siteName: "EMI Calculator",
    images: [
      {
        url: "/og-image.png", // Place an image in public/
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EMI Calculator",
    description: "Calculate your EMI for various loans.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">{children}</body>
    </html>
  );
}
