"use client";

import Image from "next/image";
import { useState } from "react";

export function TokenIcon({
  iconUrl,
  symbol,
}: {
  iconUrl: string | null;
  symbol: string;
}) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);

  if (iconUrl && iconUrl !== failedUrl) {
    return (
      <Image
        width={24}
        height={24}
        src={iconUrl}
        alt={symbol}
        className="w-6 h-6 rounded-full object-cover shrink-0"
        onError={() => setFailedUrl(iconUrl)}
      />
    );
  }
  return (
    <div className="w-6 h-6 rounded-full bg-modal-icon-bg flex items-center justify-center text-xs font-bold text-modal-muted shrink-0">
      {symbol[0]}
    </div>
  );
}
