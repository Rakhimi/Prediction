"use client";

import { useEffect, useRef, useState } from "react";
import {
  Home,
  TrendingUp,
  BookOpen,
  HelpCircle,
  Globe,
  ChevronDown,
  LogOut,
  Crown,
  Wallet,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Home", icon: Home, href: "/" },
  { label: "Match Prediction", icon: TrendingUp, href: "/analysis" },
  { label: "League Blog", icon: BookOpen, href: "/blog" },
  { label: "FAQ", icon: HelpCircle, href: "/faq" },
];

type NavbarProps = {
  member?: {
    providerUid: string;
    isMember: boolean;
    ftdAmount: string;
    recentDepositAmount: string;
  } | null;
};

export default function Navbar({ member }: NavbarProps) {
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const firstLetter = member?.providerUid?.charAt(0)?.toUpperCase() || "G";

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-gradient-to-r from-black via-[#1a1410] to-black border-b border-teal-500/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-8">
          {/* Nav */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg font-semibold
                    transition-all duration-300
                    ${
                      isActive
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

          {/* Right controls */}
          <div className="flex items-center gap-4">
            {/* Language */}
            <button className="cursor-pointer flex items-center gap-1 text-gray-400 hover:text-white transition text-sm">
              <Globe className="w-4 h-4" />
              EN
            </button>

            {/* Avatar Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setOpen(!open)}
                className="cursor-pointer flex items-center gap-2"
              >
                <div className="w-9 h-9 rounded-full bg-teal-500 flex items-center justify-center font-semibold text-black">
                  {firstLetter}
                </div>

                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${
                    open ? "rotate-180" : ""
                  }`}
                />
              </button>

              {open && (
                <div className="absolute right-0 top-14 w-72 rounded-2xl border border-teal-500/20 bg-[#111] shadow-2xl p-4 space-y-4">
                  {member ? (
                    <>
                      {/* Header */}
                      <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                        <div className="w-11 h-11 rounded-full bg-teal-500 flex items-center justify-center text-black font-bold">
                          {firstLetter}
                        </div>

                        <div>
                          <p className="text-white font-semibold">
                            User #{member.providerUid}
                          </p>

                          <p className="text-xs text-gray-400">
                            Premium Dashboard
                          </p>
                        </div>
                      </div>

                      {/* Status */}
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400 flex items-center gap-2">
                            <Crown className="w-4 h-4" />
                            Membership
                          </span>

                          <span
                            className={`font-semibold ${
                              member.isMember
                                ? "text-teal-400"
                                : "text-red-400"
                            }`}
                          >
                            {member.isMember ? "Active" : "Inactive"}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-gray-400 flex items-center gap-2">
                            <Wallet className="w-4 h-4" />
                            First Deposit
                          </span>

                          <span className="text-white">
                            {member.ftdAmount}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-gray-400 flex items-center gap-2">
                            <Wallet className="w-4 h-4" />
                            Recent Deposit
                          </span>

                          <span className="text-white">
                            {member.recentDepositAmount}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="pt-3 border-t border-white/10 space-y-2">
                        <Link
                          href="/premium"
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 text-sm text-gray-300"
                        >
                          <User className="w-4 h-4" />
                          Premium Area
                        </Link>

                        <Link
                          href="/api/logout"
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-500/10 text-sm text-red-400"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </Link>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-white font-semibold">
                        Guest User
                      </p>

                      <p className="text-sm text-gray-400">
                        Login through provider platform to access premium
                        predictions.
                      </p>

                      <Link
                        href="/"
                        className="block text-center bg-teal-500 text-black py-2 rounded-lg font-semibold"
                      >
                        Go Home
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}