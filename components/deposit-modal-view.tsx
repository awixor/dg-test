"use client";

import { useState } from "react";
import { CloseIcon, NetworkIcon } from "./icons";
import { ComingSoon } from "./coming-soon";
import { TokenData, PaginationMeta } from "@/lib/types";
import { TabBar, Tab } from "./deposit/tab-bar";
import { TokenSelectDropdown } from "./deposit/token-select-dropdown";
import { SelectDropdown } from "./deposit/select-dropdown";
import { DepositAddressSection } from "./deposit/deposit-address-section";
import { BuyCryptoSection } from "./deposit/buy-crypto-section";
import { useDepositModal, DropdownType } from "@/hooks/use-deposit-modal";
import { useTokenPagination } from "@/hooks/use-token-pagination";

export function DepositModalView({
  tokens: initialTokens,
  initialPagination,
}: {
  tokens: TokenData[];
  initialPagination: PaginationMeta;
}) {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.Deposit);

  const { allTokens, pagination, isLoadingMore, loadMore } = useTokenPagination(
    initialTokens,
    initialPagination,
  );

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
  } = useDepositModal(allTokens);

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
          <TokenSelectDropdown
            tokens={allTokens}
            pagination={pagination}
            isLoadingMore={isLoadingMore}
            onLoadMore={loadMore}
            selectedTokenId={selectedTokenId}
            selectedToken={selectedToken}
            isOpen={activeDropdown === DropdownType.Token}
            onToggle={() => toggleDropdown(DropdownType.Token)}
            onSelect={selectToken}
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
