"use client";

import { useState } from "react";
import { TokenData } from "@/lib/types";

export enum DropdownType {
  Token = "token",
  Network = "network",
  None = "none",
}

export function useDepositModal(tokens: TokenData[]) {
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
  const networkIconUrl = selectedNetworkEntry?.network.iconUrl ?? null;

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

  return {
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
  };
}
