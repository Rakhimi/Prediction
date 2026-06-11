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
        transition-transform duration-200
        hover:scale-110
      "
      aria-label="Contact us on Telegram"
    >
      <Image
        src="/images/tortoise.png"
        alt="Telegram Support"
        width={100}
        height={100}
        className="object-contain drop-shadow-lg"
      />
    </a>
  );
}