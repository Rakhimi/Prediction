import type { Metadata } from "next";
import { Cuprum } from "next/font/google";
import "./globals.css";

const cuprum = Cuprum({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-cuprum", 
});

export const metadata: Metadata = {
  title: "Football Prediction",
  description: "Football Prediction Analysis",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cuprum.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-cuprum">
        {children}
      </body>
    </html>
  );
}
