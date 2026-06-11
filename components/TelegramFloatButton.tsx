"use client";

import Image from "next/image";

export default function TelegramFloatButton() {
  const telegramUrl = "https://t.me/new8scoreai";

  return (
    <a
      href={telegramUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="
        fixed bottom-6 right-6
        z-[9999]
        flex items-center justify-center
        h-14 w-14
        rounded-full
        bg-[#229ED9]
        shadow-lg
        transition-all duration-200
        hover:scale-110 hover:shadow-xl
      "
      aria-label="Contact us on Telegram"
    >
      <Image
        src="/tortoise.png"
        alt="Telegram Support"
        width={28}
        height={28}
        className="object-contain"
      />
    </a>
  );
}