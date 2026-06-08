"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-orange-500/10 bg-gradient-to-r from-black via-[#1a1410] to-black mt-20">
      <div className="max-w-7xl mx-auto px-6 py-16">

        {/* TOP SECTION */}
        <div className="max-w-4xl mx-auto mb-10 font-semibold">

          {/* LOGO */}
          <div className="flex justify-center mb-6">
            <img
              src="/logo.png"
              alt="new8scoreai"
              className="h-14 w-auto"
            />
          </div>

          {/* CONTENT CARD */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8">
            <h3 className="text-xl font-bold text-teal-400 mb-4">
              Experience Free Livestream Football on New8scoreai
            </h3>

            <p className="text-gray-300 text-sm leading-6">
              Football is watched by billions of fans worldwide, but many supporters
              still pay subscription fees to access live matches. New8scoreai provides
              football enthusiasts with a platform to follow live football action and
              stay updated with major tournaments and leagues. Enjoy match insights,
              real-time updates, and AI-powered football analysis all in one place,
              designed to enhance your football viewing experience.
            </p>
          </div>

        </div>

        {/* DIVIDER */}
        <div className="border-t border-orange-500/10 my-10" />

        {/* PROMO SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 font-semibold">

          {/* BRAND */}
          <div className="space-y-5">
            <Link href="/" className="flex items-center gap-2">
              <img src="/logo.png" alt="mescoreAI" className="h-10 w-auto" />
            </Link>

            <p className="text-gray-400 leading-relaxed max-w-sm">
              AI-powered football predictions to help you make smarter betting decisions with advanced analytics and match insights.
            </p>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-5">
              Quick Links
            </h3>

            <div className="flex flex-col gap-3">
              <Link href="/" className="text-gray-400 hover:text-teal-400 transition">
                Home
              </Link>

              <Link href="/analysis" className="text-gray-400 hover:text-teal-400 transition">
                Predictions
              </Link>

              <Link href="/" className="text-gray-400 hover:text-teal-400 transition">
                FAQ
              </Link>
            </div>
          </div>

          {/* CONNECT */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-5">
              Connect
            </h3>

            <div className="flex items-center gap-4">

              {/* TELEGRAM */}
              <a href="#" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-teal-500/20 hover:border-teal-500/30 transition">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 3L3 10.53l6.75 2.25L12 20l9-17z" />
                </svg>
              </a>

              {/* APPLE */}
              <a href="#" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-teal-500/20 hover:border-teal-500/30 transition">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16.365 1.43c0 1.14-.465 2.224-1.238 3.014-.82.84-2.16 1.49-3.32 1.39-.15-1.11.48-2.29 1.23-3.05.83-.84 2.24-1.44 3.33-1.35zM20.46 17.03c-.62 1.42-.92 2.05-1.72 3.33-1.11 1.79-2.67 4.03-4.6 4.05-1.72.02-2.16-1.12-4.5-1.11-2.34.01-2.83 1.13-4.55 1.11-1.93-.02-3.41-2.03-4.52-3.82C-2.1 16.2-.69 9.1 3.02 7c1.82-1.03 4.57-.83 6.23.4 1.6 1.18 2.1 1.2 3.8 0 1.55-1.1 4.02-1.2 5.73-.3-4.96 2.72-4.16 9.78 1.68 10.93z" />
                </svg>
              </a>

              {/* MOBILE */}
              <a href="#" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-teal-500/20 hover:border-teal-500/30 transition">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <rect x="7" y="2" width="10" height="20" rx="2" strokeWidth="2" />
                  <path d="M11 18h2" strokeWidth="2" />
                </svg>
              </a>

            </div>
          </div>
        </div>

        <div className="border-t border-orange-500/10 my-10" />

        {/* BOTTOM */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500 text-center md:text-right">
            © 2026 new8scoreai. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}