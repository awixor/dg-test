"use client";

import { TokenIcon } from "@/components/icons";
import { TokenData, PaginationMeta } from "@/lib/types";
import { SelectDropdown } from "./select-dropdown";

interface TokenSelectDropdownProps {
  tokens: TokenData[];
  pagination: PaginationMeta;
  isLoadingMore: boolean;
  onLoadMore: () => void;
  selectedTokenId: number | null;
  selectedToken: TokenData | null;
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (id: number) => void;
  loadMoreError?: string | null;
}

export function TokenSelectDropdown({
  tokens,
  pagination,
  isLoadingMore,
  onLoadMore,
  selectedTokenId,
  selectedToken,
  isOpen,
  onToggle,
  onSelect,
  loadMoreError,
}: TokenSelectDropdownProps) {
  return (
    <SelectDropdown
      isOpen={isOpen}
      onToggle={onToggle}
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
      onSelect={(id) => onSelect(id as number)}
      hasMore={pagination.hasNextPage}
      isLoadingMore={isLoadingMore}
      onLoadMore={onLoadMore}
      loadMoreError={loadMoreError}
    />
  );
}
