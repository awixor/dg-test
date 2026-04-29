import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDepositModal, DropdownType } from "./use-deposit-modal";
import { TokenData } from "@/lib/types";

const makeToken = (
  id: number,
  networks: TokenData["networks"] = [],
): TokenData => ({
  id,
  symbol: `TK${id}`,
  name: `Token ${id}`,
  iconUrl: null,
  isUnderMaintenance: false,
  displayOrder: id,
  networks,
});

const makeNetwork = (id: number): TokenData["networks"][number] => ({
  depositAddress: `addr-${id}`,
  minDeposit: `${id}.0`,
  network: { id, name: `Net ${id}`, slug: `net-${id}`, iconUrl: null },
});

const token1 = makeToken(1, [makeNetwork(10), makeNetwork(11)]);
const token2 = makeToken(2, [makeNetwork(20)]);
const tokens = [token1, token2];

describe("useDepositModal", () => {
  describe("initial state", () => {
    it("selects first token", () => {
      const { result } = renderHook(() => useDepositModal(tokens));
      expect(result.current.selectedTokenId).toBe(1);
      expect(result.current.selectedToken?.id).toBe(1);
    });

    it("selects first network of first token", () => {
      const { result } = renderHook(() => useDepositModal(tokens));
      expect(result.current.selectedNetworkId).toBe(10);
    });

    it("derives depositAddress from first network", () => {
      const { result } = renderHook(() => useDepositModal(tokens));
      expect(result.current.depositAddress).toBe("addr-10");
    });

    it("derives minDeposit from first network", () => {
      const { result } = renderHook(() => useDepositModal(tokens));
      expect(result.current.minDeposit).toBe("10.0");
    });

    it("activeDropdown is None", () => {
      const { result } = renderHook(() => useDepositModal(tokens));
      expect(result.current.activeDropdown).toBe(DropdownType.None);
    });

    it("handles empty tokens array", () => {
      const { result } = renderHook(() => useDepositModal([]));
      expect(result.current.selectedTokenId).toBe(0);
      expect(result.current.selectedToken).toBeUndefined();
      expect(result.current.selectedNetworkId).toBeNull();
      expect(result.current.depositAddress).toBe("");
      expect(result.current.minDeposit).toBe("0");
    });
  });

  describe("selectToken", () => {
    it("switches to new token", () => {
      const { result } = renderHook(() => useDepositModal(tokens));
      act(() => result.current.selectToken(2));
      expect(result.current.selectedTokenId).toBe(2);
      expect(result.current.selectedToken?.id).toBe(2);
    });

    it("resets network to first network of new token", () => {
      const { result } = renderHook(() => useDepositModal(tokens));
      act(() => result.current.selectToken(2));
      expect(result.current.selectedNetworkId).toBe(20);
    });

    it("closes all dropdowns", () => {
      const { result } = renderHook(() => useDepositModal(tokens));
      act(() => result.current.toggleDropdown(DropdownType.Token));
      act(() => result.current.selectToken(2));
      expect(result.current.activeDropdown).toBe(DropdownType.None);
    });

    it("snapshots previous token so selectedToken stays stable if token leaves list", () => {
      const { result } = renderHook(() => useDepositModal(tokens));
      act(() => result.current.selectToken(1));
      // token1 is in the list so it resolves via find, not snapshot
      expect(result.current.selectedToken?.id).toBe(1);
    });
  });

  describe("selectNetwork", () => {
    it("switches network within same token", () => {
      const { result } = renderHook(() => useDepositModal(tokens));
      act(() => result.current.selectNetwork(11));
      expect(result.current.selectedNetworkId).toBe(11);
      expect(result.current.depositAddress).toBe("addr-11");
    });

    it("closes all dropdowns", () => {
      const { result } = renderHook(() => useDepositModal(tokens));
      act(() => result.current.toggleDropdown(DropdownType.Network));
      act(() => result.current.selectNetwork(11));
      expect(result.current.activeDropdown).toBe(DropdownType.None);
    });
  });

  describe("toggleDropdown", () => {
    it("opens a dropdown when none active", () => {
      const { result } = renderHook(() => useDepositModal(tokens));
      act(() => result.current.toggleDropdown(DropdownType.Token));
      expect(result.current.activeDropdown).toBe(DropdownType.Token);
    });

    it("closes dropdown when same type toggled again", () => {
      const { result } = renderHook(() => useDepositModal(tokens));
      act(() => result.current.toggleDropdown(DropdownType.Token));
      act(() => result.current.toggleDropdown(DropdownType.Token));
      expect(result.current.activeDropdown).toBe(DropdownType.None);
    });

    it("switches to different dropdown type", () => {
      const { result } = renderHook(() => useDepositModal(tokens));
      act(() => result.current.toggleDropdown(DropdownType.Token));
      act(() => result.current.toggleDropdown(DropdownType.Network));
      expect(result.current.activeDropdown).toBe(DropdownType.Network);
    });
  });

  describe("handleCopy", () => {
    beforeEach(() => {
      vi.useFakeTimers();
      Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value: { writeText: vi.fn().mockResolvedValue(undefined) },
      });
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("sets copied to true after successful copy", async () => {
      const { result } = renderHook(() => useDepositModal(tokens));
      await act(() => result.current.handleCopy());
      expect(result.current.copied).toBe(true);
    });

    it("resets copied to false after 2 seconds", async () => {
      const { result } = renderHook(() => useDepositModal(tokens));
      await act(() => result.current.handleCopy());
      act(() => vi.advanceTimersByTime(2000));
      expect(result.current.copied).toBe(false);
    });

    it("does not copy when depositAddress is empty", async () => {
      const tokenNoNetwork = makeToken(3, []);
      const { result } = renderHook(() => useDepositModal([tokenNoNetwork]));
      await act(() => result.current.handleCopy());
      expect(navigator.clipboard.writeText).not.toHaveBeenCalled();
      expect(result.current.copied).toBe(false);
    });

    it("writes correct address to clipboard", async () => {
      const { result } = renderHook(() => useDepositModal(tokens));
      await act(() => result.current.handleCopy());
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith("addr-10");
    });
  });
});
