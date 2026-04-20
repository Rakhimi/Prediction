"use client";

import { useState } from "react";
import { Home, TrendingUp, BookOpen, HelpCircle, Globe } from "lucide-react";
import Link from "next/link";

const navItems = [
  { label: "Home", icon: Home, href: "/" },
  { label: "Match Prediction", icon: TrendingUp, href: "/analysis" },
  { label: "League Blog", icon: BookOpen, href: "/blog" },
  { label: "FAQ", icon: HelpCircle, href: "/faq" },
];

export default function Navbar() {
  const [active, setActive] = useState("Home");

  return (
    <div className="bg-gradient-to-r from-black via-[#1a1410] to-black border-b border-teal-500/10">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
        </div>

        {/* RIGHT SIDE GROUP (nav + controls together) */}
        <div className="flex items-center gap-8">
          
          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = active === item.label;

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setActive(item.label)}
                  className={`
                    cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg
                    font-semibold transition-all duration-300
                    ${isActive
                      ? "bg-teal-500 text-black shadow-md scale-105"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            
            {/* Language */}
            <button className="cursor-pointer flex items-center gap-1 text-gray-400 hover:text-white transition text-sm">
              <Globe className="w-4 h-4" />
              EN
            </button>

            {/* Avatar */}
            <div className="w-9 h-9 rounded-full bg-teal-500 flex items-center justify-center font-semibold text-black">
              K
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}