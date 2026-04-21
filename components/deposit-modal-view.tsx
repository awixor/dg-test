"use client";

import { useState } from "react";
import { CloseIcon, TokenIcon, NetworkIcon } from "./icons";
import { ComingSoon } from "./coming-soon";
import { TokenData } from "@/lib/types";
import { TabBar, Tab } from "./deposit/tab-bar";
import { SelectDropdown } from "./deposit/select-dropdown";
import { DepositAddressSection } from "./deposit/deposit-address-section";
import { BuyCryptoSection } from "./deposit/buy-crypto-section";
import { useDepositModal, DropdownType } from "@/hooks/use-deposit-modal";

export function DepositModalView({ tokens }: { tokens: TokenData[] }) {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.Deposit);

  const {
    selectedToken,
    selectedNetworkIdx,
    selectedTokenId,
    depositAddress,
    minDeposit,
    networkName,
    networkIconUrl,
    copied,
    activeDropdown,
    closeAllMenus,
    selectToken,
    selectNetwork,
    toggleDropdown,
    handleCopy,
  } = useDepositModal(tokens);

  const renderContent = () => {
    if (activeTab !== Tab.Deposit) {
      return <ComingSoon label={activeTab} />;
    }

    return (
      <>
        <div className="bg-modal-surface rounded-[9px] p-3">
          <p className="text-sm text-modal-muted font-normal mb-2">
            Choose token
          </p>
          <SelectDropdown
            isOpen={activeDropdown === DropdownType.Token}
            onToggle={() => toggleDropdown(DropdownType.Token)}
            triggerIcon={
              <TokenIcon
                iconUrl={selectedToken?.iconUrl ?? null}
                symbol={selectedToken?.symbol ?? ""}
              />
            }
            triggerLabel={selectedToken?.symbol}
            triggerBadge={
              selectedToken?.isUnderMaintenance ? (
                <span className="text-[10px] font-bold text-warning-text bg-warning-gold rounded px-1.5 py-0.5">
                  Maintenance
                </span>
              ) : undefined
            }
            options={tokens.map((token) => ({
              id: token.id,
              label: token.symbol,
              sublabel: token.name,
              icon: <TokenIcon iconUrl={token.iconUrl} symbol={token.symbol} />,
              badge: token.isUnderMaintenance ? (
                <span className="text-[10px] font-bold text-warning-text bg-warning-gold rounded px-1.5 py-0.5">
                  Maintenance
                </span>
              ) : undefined,
              isSelected: token.id === selectedTokenId,
            }))}
            onSelect={(id) => selectToken(id as number)}
          />
        </div>

        <div className="bg-modal-surface rounded-[9px] p-3">
          <p className="text-sm text-modal-muted font-normal mb-2">
            Choose network
          </p>
          <SelectDropdown
            isOpen={activeDropdown === DropdownType.Network}
            onToggle={() => toggleDropdown(DropdownType.Network)}
            triggerIcon={
              <NetworkIcon iconUrl={networkIconUrl} name={networkName} />
            }
            triggerLabel={networkName}
            options={(selectedToken?.networks ?? []).map((entry, idx) => ({
              id: entry.network.id,
              label: entry.network.name,
              icon: (
                <NetworkIcon
                  iconUrl={entry.network.iconUrl}
                  name={entry.network.name}
                />
              ),
              isSelected: idx === selectedNetworkIdx,
            }))}
            onSelect={(id) => {
              const idx =
                selectedToken?.networks.findIndex((e) => e.network.id === id) ??
                0;
              selectNetwork(idx);
            }}
          />
        </div>

        <DepositAddressSection
          selectedToken={selectedToken}
          networkName={networkName}
          depositAddress={depositAddress}
          minDeposit={minDeposit}
          copied={copied}
          onCopy={handleCopy}
        />

        <p className="text-center text-white text-sm">or</p>

        <BuyCryptoSection />
      </>
    );
  };

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
            <button className="text-white hover:opacity-70 transition-opacity cursor-pointer">
              <CloseIcon />
            </button>
          </div>

          <TabBar activeTab={activeTab} onChange={setActiveTab} />

          {renderContent()}
        </div>
      </div>
    </div>
  );
}
