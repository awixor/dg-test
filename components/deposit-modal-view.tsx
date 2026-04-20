"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import Image from "next/image";
import { CloseIcon, ChevronDown, WarningIcon, TokenIcon } from "./icons";
import { PAYMENT_ICONS } from "@/lib/constants";
import { TokenData } from "@/lib/types";

type Tab = "balance" | "deposit" | "withdraw";

enum DropdownType {
  Token = "token",
  Network = "network",
  None = "none",
}

export function DepositModalView({ tokens }: { tokens: TokenData[] }) {
  const [activeTab, setActiveTab] = useState<Tab>("deposit");
  const [selectedTokenId, setSelectedTokenId] = useState<number>(
    tokens[0]?.id ?? 0,
  );
  const [selectedNetworkIdx, setSelectedNetworkIdx] = useState(0);
  const [copied, setCopied] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<DropdownType>(
    DropdownType.None,
  );

  const selectedToken =
    tokens.find((token) => token.id === selectedTokenId) ?? tokens[0];
  const selectedNetworkEntry = selectedToken?.networks[selectedNetworkIdx];
  const depositAddress = selectedNetworkEntry?.depositAddress ?? "";
  const minDeposit = selectedNetworkEntry?.minDeposit ?? "0";
  const networkName = selectedNetworkEntry?.network.name ?? "";

  function closeAllMenus() {
    setActiveDropdown(DropdownType.None);
  }

  function selectToken(id: number) {
    setSelectedTokenId(id);
    setSelectedNetworkIdx(0);
    closeAllMenus();
  }

  function selectNetwork(idx: number) {
    setSelectedNetworkIdx(idx);
    closeAllMenus();
  }

  function toggleDropdown(type: DropdownType) {
    setActiveDropdown((prev) => (prev === type ? DropdownType.None : type));
  }

  async function handleCopy() {
    if (!depositAddress) return;
    try {
      await navigator.clipboard.writeText(depositAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      console.log("Failed to copy");
    }
  }

  const TABS: { key: Tab; label: string }[] = [
    { key: "balance", label: "Balance" },
    { key: "deposit", label: "Deposit" },
    { key: "withdraw", label: "Withdraw" },
  ];

  return (
    <div
      className="min-h-screen bg-black flex items-center justify-center p-4"
      onClick={closeAllMenus}
    >
      <div
        className="w-full max-w-95.5 bg-modal-bg border border-modal-border rounded-[9px] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-4 px-3 pt-3 pb-6">
          <div className="flex justify-end">
            <button className="text-white hover:opacity-70 transition-opacity">
              <CloseIcon />
            </button>
          </div>

          <div className="bg-modal-dark rounded-md p-1 flex gap-1 h-9.5">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 rounded-[3px] text-sm font-bold transition-colors duration-150 ${
                  activeTab === tab.key
                    ? "bg-modal-bg text-white"
                    : "text-modal-muted hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="bg-modal-surface rounded-[9px] p-3">
            <p className="text-sm text-modal-muted font-normal mb-2">
              Choose token
            </p>
            <div className="relative">
              <button
                className="w-full flex items-center gap-2 bg-modal-bg rounded-md px-2 py-2 hover:bg-modal-hover transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDropdown(DropdownType.Token);
                }}
              >
                <TokenIcon
                  iconUrl={selectedToken?.iconUrl ?? null}
                  symbol={selectedToken?.symbol ?? ""}
                />
                <span className="flex-1 text-left text-sm text-modal-muted">
                  {selectedToken?.symbol}
                </span>
                <ChevronDown />
              </button>
              {activeDropdown === DropdownType.Token && (
                <div className="absolute z-10 mt-1 w-full bg-modal-bg border border-modal-border rounded-[9px] overflow-hidden shadow-xl">
                  {tokens.map((token) => (
                    <button
                      key={token.id}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-modal-icon-bg transition-colors ${token.id === selectedTokenId ? "bg-modal-icon-bg" : ""}`}
                      onClick={() => selectToken(token.id)}
                    >
                      <TokenIcon
                        iconUrl={token.iconUrl}
                        symbol={token.symbol}
                      />
                      <span className="font-medium text-white text-sm">
                        {token.symbol}
                      </span>
                      <span className="text-modal-muted text-xs">
                        {token.name}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="bg-modal-surface rounded-[9px] p-3">
            <p className="text-sm text-modal-muted font-normal mb-2">
              Choose network
            </p>
            <div className="relative">
              <button
                className="w-full flex items-center gap-2 bg-modal-bg rounded-md px-2 py-2 hover:bg-modal-hover transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDropdown(DropdownType.Network);
                }}
              >
                <div className="w-6 h-6 rounded-full bg-modal-icon-bg shrink-0" />
                <span className="flex-1 text-left text-sm text-modal-muted">
                  {networkName}
                </span>
                <ChevronDown />
              </button>
              {activeDropdown === DropdownType.Network && selectedToken && (
                <div className="absolute z-10 mt-1 w-full bg-modal-bg border border-modal-border rounded-[9px] overflow-hidden shadow-xl">
                  {selectedToken.networks.map((entry, idx) => (
                    <button
                      key={entry.network.id}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-modal-icon-bg transition-colors ${idx === selectedNetworkIdx ? "bg-modal-icon-bg" : ""}`}
                      onClick={() => selectNetwork(idx)}
                    >
                      <div className="w-6 h-6 rounded-full bg-modal-icon-bg shrink-0" />
                      <span className="font-medium text-white text-sm">
                        {entry.network.name}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="bg-modal-surface rounded-[9px] p-3 flex flex-col gap-4 items-center">
            {selectedToken && networkName && (
              <div className="flex gap-3 bg-warning-gold rounded-md p-2 w-full items-center">
                <WarningIcon />
                <p className="text-sm text-warning-text leading-snug">
                  Send <strong>{selectedToken.symbol}</strong> ONLY on the{" "}
                  <strong>{networkName} network</strong> to this address or your
                  funds may be lost.
                </p>
              </div>
            )}

            {depositAddress ? (
              <div className="bg-white p-2 rounded-md">
                <QRCodeSVG value={depositAddress} size={120} />
              </div>
            ) : (
              <div className="w-30 h-30 bg-modal-icon-bg rounded-md" />
            )}

            <div className="w-full flex flex-col gap-1">
              <p className="text-[11.2px] text-modal-muted font-bold uppercase tracking-[0.896px]">
                Address
              </p>
              <p className="text-sm text-white font-normal leading-[1.6] break-all">
                {depositAddress}
              </p>
            </div>

            <button
              onClick={handleCopy}
              disabled={!depositAddress}
              className="w-full py-2 rounded-[9px] font-bold text-sm text-accent-text bg-accent-purple border border-accent-border transition-all duration-150 hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed capitalize"
            >
              {copied ? "Copied!" : `Copy ${selectedToken?.symbol} Address`}
            </button>

            <div className="w-full flex flex-col gap-1">
              <p className="text-[11.2px] text-modal-muted font-bold uppercase tracking-[0.896px]">
                Network
              </p>
              <p className="text-sm text-white">{networkName}</p>
            </div>

            <p className="text-sm text-modal-muted leading-[1.6] w-full">
              Deposits less than{" "}
              <strong className="text-white font-bold">{minDeposit}</strong>
              <strong className="text-white font-bold">
                {" "}
                {selectedToken?.symbol}
              </strong>{" "}
              will NOT be credited to your balance.
            </p>

            <button className="text-brand-link hover:opacity-80 text-sm font-bold transition-colors capitalize">
              Transaction History
            </button>
          </div>

          <p className="text-center text-white text-sm">or</p>

          <div className="bg-modal-dark rounded-[9px] p-3 flex flex-col gap-3">
            <button className="w-full py-2 rounded-[9px] font-bold text-sm text-white bg-modal-bg hover:bg-modal-hover transition-colors capitalize">
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
        </div>
      </div>
    </div>
  );
}
