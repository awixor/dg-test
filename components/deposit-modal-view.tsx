"use client";

import { useState } from "react";
import { CloseIcon, NetworkIcon } from "./icons";
import { ComingSoon } from "./coming-soon";
import { TabBar, Tab } from "./deposit/tab-bar";
import { TokenSelectDropdown } from "./deposit/token-select-dropdown";
import { SelectDropdown } from "./deposit/select-dropdown";
import { DepositAddressSection } from "./deposit/deposit-address-section";
import { BuyCryptoSection } from "./deposit/buy-crypto-section";
import { useDepositModal, DropdownType } from "@/hooks/use-deposit-modal";
import { useTokenPagination } from "@/hooks/use-token-pagination";

export function DepositModalView({
  initialLimit,
}: {
  initialLimit: number;
}) {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.Deposit);

  const { allTokens, pagination, isLoading, error, loadMore, search } =
    useTokenPagination(initialLimit);
  const loadMoreError = error
    ? "Failed to load more tokens. Please try again."
    : null;

  const [networkSearch, setNetworkSearch] = useState("");

  const {
    selectedToken,
    selectedNetworkId,
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
            id="token-select-dropdown"
            tokens={allTokens}
            pagination={pagination}
            isLoading={isLoading}
            onLoadMore={loadMore}
            selectedTokenId={selectedTokenId}
            selectedToken={selectedToken}
            isOpen={activeDropdown === DropdownType.Token}
            onToggle={() => toggleDropdown(DropdownType.Token)}
            onSelect={selectToken}
            onSearch={search}
            loadMoreError={loadMoreError}
          />
        </div>

        <div className="bg-modal-surface rounded-[9px] p-3">
          <p className="text-sm text-modal-muted font-normal mb-2">
            Choose network
          </p>
          <SelectDropdown
            id="network-select-dropdown"
            isOpen={activeDropdown === DropdownType.Network}
            onToggle={() => toggleDropdown(DropdownType.Network)}
            triggerIcon={
              <NetworkIcon iconUrl={networkIconUrl} name={networkName} />
            }
            triggerLabel={networkName}
            onSearch={setNetworkSearch}
            searchPlaceholder="Search network…"
            options={(selectedToken?.networks ?? [])
              .filter((entry) =>
                networkSearch
                  ? entry.network.name
                      .toLowerCase()
                      .includes(networkSearch.toLowerCase())
                  : true,
              )
              .map((entry) => ({
                id: entry.network.id,
                label: entry.network.name,
                icon: (
                  <NetworkIcon
                    iconUrl={entry.network.iconUrl}
                    name={entry.network.name}
                  />
                ),
                isSelected: entry.network.id === selectedNetworkId,
              }))}
            onSelect={(id) => selectNetwork(id as number)}
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
        className="w-full max-w-95.5 max-h-[90vh] bg-modal-bg border border-modal-border rounded-[9px] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-4 px-3 pt-3">
          <div className="flex justify-end">
            <button
              id="close-modal-button"
              className="text-white hover:opacity-70 transition-opacity cursor-pointer"
            >
              <CloseIcon />
            </button>
          </div>

          <TabBar activeTab={activeTab} onChange={setActiveTab} />
        </div>

        <div className="flex flex-col gap-4 px-1 pt-6 pb-4 mb-2 overflow-y-auto scrollbar-modal scroll-fade-top">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
