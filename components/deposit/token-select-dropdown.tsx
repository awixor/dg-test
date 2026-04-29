"use client";

import { TokenIcon } from "@/components/icons";
import { TokenData, PaginationMeta } from "@/lib/types";
import { SelectDropdown } from "./select-dropdown";
import { Badge } from "../badge";

interface TokenSelectDropdownProps {
  id?: string;
  tokens: TokenData[];
  pagination: PaginationMeta;
  isLoading: boolean;
  onLoadMore: () => void;
  selectedTokenId: number | null;
  selectedToken: TokenData | null;
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (id: number) => void;
  onSearch: (query: string) => void;
  loadMoreError?: string | null;
}

export function TokenSelectDropdown({
  id,
  tokens,
  pagination,
  isLoading,
  onLoadMore,
  selectedTokenId,
  selectedToken,
  isOpen,
  onToggle,
  onSelect,
  onSearch,
  loadMoreError,
}: TokenSelectDropdownProps) {
  return (
    <SelectDropdown
      id={id}
      isOpen={isOpen}
      onToggle={onToggle}
      onSearch={onSearch}
      searchPlaceholder="Search token…"
      triggerIcon={
        <TokenIcon
          iconUrl={selectedToken?.iconUrl ?? null}
          symbol={selectedToken?.symbol ?? ""}
        />
      }
      triggerLabel={selectedToken?.symbol}
      triggerBadge={
        selectedToken?.isUnderMaintenance ? (
          <Badge label="Maintenance" />
        ) : undefined
      }
      options={tokens.map((token) => ({
        id: token.id,
        label: token.symbol,
        sublabel: token.name,
        icon: <TokenIcon iconUrl={token.iconUrl} symbol={token.symbol} />,
        badge: token.isUnderMaintenance ? (
          <Badge label="Maintenance" />
        ) : undefined,
        isSelected: token.id === selectedTokenId,
      }))}
      onSelect={(id) => onSelect(id as number)}
      hasMore={pagination.hasNextPage}
      isLoading={isLoading}
      onLoadMore={onLoadMore}
      loadMoreError={loadMoreError}
    />
  );
}
