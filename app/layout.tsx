import type { Metadata } from "next";
import { Cuprum } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { getCurrentMember } from "@/lib/auth";
import AuthModalWrapper from "@/components/AuthModalWrapper";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";

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

  return (
    <html lang="en" className={`${cuprum.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-cuprum bg-black text-white">
        <Toaster/>
        <Navbar/>
        {children}
        <Footer />
        <AuthModalWrapper />
      </body>
    </html>
  );
}