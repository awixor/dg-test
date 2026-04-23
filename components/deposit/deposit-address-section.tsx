"use client";

import { QRCodeSVG } from "qrcode.react";
import { TokenData } from "@/lib/types";
import { truncateAddress } from "@/lib/utils";
import { WarningBanner } from "./warning-banner";

interface DepositAddressSectionProps {
  selectedToken: TokenData | undefined;
  networkName: string;
  depositAddress: string;
  minDeposit: string;
  copied: boolean;
  onCopy: () => void;
}

export function DepositAddressSection({
  selectedToken,
  networkName,
  depositAddress,
  minDeposit,
  copied,
  onCopy,
}: DepositAddressSectionProps) {
  const isUnderMaintenance = selectedToken?.isUnderMaintenance;

  return (
    <div className="bg-modal-surface rounded-[9px] p-3 flex flex-col gap-4 items-center">
      {isUnderMaintenance ? (
        <WarningBanner>
          <strong>{selectedToken?.symbol}</strong> is currently under
          maintenance. Deposits are temporarily unavailable.
        </WarningBanner>
      ) : (
        selectedToken &&
        networkName && (
          <WarningBanner>
            Send <strong>{selectedToken.symbol}</strong> ONLY on the{" "}
            <strong>{networkName} network</strong> to this address or your funds
            may be lost.
          </WarningBanner>
        )
      )}

      {depositAddress && !isUnderMaintenance ? (
        <div className="bg-white p-2 rounded-md">
          <QRCodeSVG value={depositAddress} size={120} />
        </div>
      ) : (
        <div className="w-34 h-34 bg-modal-icon-bg rounded-md" />
      )}

      <div className="w-full flex flex-col gap-1">
        <p className="text-[11.2px] text-modal-muted font-bold uppercase tracking-[0.896px]">
          Address
        </p>
        <p
          className="text-sm text-white font-mono leading-[1.6] break-all"
          title={depositAddress}
        >
          {depositAddress ? (
            truncateAddress(depositAddress)
          ) : (
            <span className="text-modal-muted">—</span>
          )}
        </p>
      </div>

      <button
        id="copy-address-button"
        onClick={onCopy}
        disabled={!depositAddress || isUnderMaintenance}
        className="w-full py-2 rounded-[9px] font-bold text-sm cursor-pointer text-accent-text bg-accent-purple border border-accent-border transition-all duration-150 hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed capitalize"
      >
        {copied ? "Copied!" : `Copy ${selectedToken?.symbol} Address`}
      </button>

      <div className="w-full flex flex-col gap-1">
        <p className="text-[11.2px] text-modal-muted font-bold uppercase tracking-[0.896px]">
          Network
        </p>
        <p className="text-sm text-white">{networkName || "—"}</p>
      </div>

      <p className="text-sm text-modal-muted leading-[1.6] w-full">
        Deposits less than{" "}
        <strong className="text-white font-bold">{Number(minDeposit).toLocaleString()}</strong>
        <strong className="text-white font-bold">
          {" "}
          {selectedToken?.symbol}
        </strong>{" "}
        will NOT be credited to your balance.
      </p>

      <button className="text-brand-link hover:opacity-80 cursor-pointer text-sm font-bold transition-colors capitalize">
        Transaction History
      </button>
    </div>
  );
}
