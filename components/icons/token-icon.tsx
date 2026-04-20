import Image from "next/image";

export function TokenIcon({
  iconUrl,
  symbol,
}: {
  iconUrl: string | null;
  symbol: string;
}) {
  if (iconUrl) {
    return (
      <Image
        width={24}
        height={24}
        src={iconUrl}
        alt={symbol}
        className="w-6 h-6 rounded-full object-cover shrink-0"
      />
    );
  }
  return (
    <div className="w-6 h-6 rounded-full bg-[#2a2a2a] flex items-center justify-center text-xs font-bold text-[#cfcfcf] shrink-0">
      {symbol[0]}
    </div>
  );
}
