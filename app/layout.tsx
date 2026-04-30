import type { Metadata } from "next";
import { Cuprum } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { getCurrentMember } from "@/lib/auth";

const cuprum = Cuprum({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-cuprum",
});

export const metadata: Metadata = {
  title: "Football Prediction",
  description: "Football Prediction Analysis",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const member = await getCurrentMember();

  return (
    <html lang="en" className={`${cuprum.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-cuprum">
        <Navbar member={member} />
        {children}
      </body>
    </html>
  );
}