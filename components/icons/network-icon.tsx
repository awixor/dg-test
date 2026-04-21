"use client";

import { useState } from "react";
import Image from "next/image";

export function NetworkIcon({
  iconUrl,
  name,
}: {
  iconUrl: string | null;
  name: string;
}) {
  const [failed, setFailed] = useState(false);

  if (iconUrl && !failed) {
    return (
      <Image
        width={24}
        height={24}
        src={iconUrl}
        alt={name}
        className="w-6 h-6 rounded-full object-cover shrink-0"
        onError={() => setFailed(true)}
      />
    );
  }
  return (
    <div className="w-6 h-6 rounded-full bg-modal-icon-bg flex items-center justify-center text-xs font-bold text-modal-muted shrink-0">
      {name[0]}
    </div>
  );
}
