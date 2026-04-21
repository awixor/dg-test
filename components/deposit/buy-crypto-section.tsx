import Image from "next/image";
import { PAYMENT_ICONS } from "@/lib/constants";

export function BuyCryptoSection() {
  return (
    <div className="bg-modal-dark rounded-[9px] p-3 flex flex-col gap-3">
      <button className="w-full py-2 rounded-[9px] font-bold cursor-pointer text-sm text-white bg-modal-bg hover:bg-modal-hover transition-colors capitalize">
        Buy Crypto
      </button>

      <div className="flex items-center justify-center gap-2">
        {PAYMENT_ICONS.map(({ id, src, alt }) => (
          <div key={id} className="w-6 h-6 bg-modal-bg rounded-md p-1">
            <Image src={src} alt={alt} width={16} height={16} />
          </div>
        ))}
      </div>
    </div>
  );
}
