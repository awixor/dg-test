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
  const [tokenSnapshot, setTokenSnapshot] = useState<TokenData | null>(
    tokens[0] ?? null,
  );
  const [selectedNetworkId, setSelectedNetworkId] = useState<number | null>(
    tokens[0]?.networks[0]?.network.id ?? null,
  );
  const [copied, setCopied] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<DropdownType>(
    DropdownType.None,
  );

  const selectedToken =
    tokens.find((token) => token.id === selectedTokenId) ??
    tokenSnapshot ??
    tokens[0];
  const selectedNetworkEntry =
    selectedToken?.networks.find((n) => n.network.id === selectedNetworkId) ??
    selectedToken?.networks[0];
  const depositAddress = selectedNetworkEntry?.depositAddress ?? "";
  const minDeposit = selectedNetworkEntry?.minDeposit ?? "0";
  const networkName = selectedNetworkEntry?.network.name ?? "";
  const networkIconUrl = selectedNetworkEntry?.network.iconUrl ?? null;

  function closeAllMenus() {
    setActiveDropdown(DropdownType.None);
  }

  function selectToken(id: number) {
    const token = tokens.find((t) => t.id === id);
    if (token) setTokenSnapshot(token);
    setSelectedTokenId(id);
    setSelectedNetworkId(token?.networks[0]?.network.id ?? null);
    closeAllMenus();
  }

  function selectNetwork(id: number) {
    setSelectedNetworkId(id);
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
    selectedNetworkId,
    selectedTokenId,
    depositAddress,
    minDeposit,
    networkName,
    networkIconUrl,
    copied,
    activeDropdown,
    selectToken,
    selectNetwork,
    toggleDropdown,
    handleCopy,
  };
}
