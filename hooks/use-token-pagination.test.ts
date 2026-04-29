import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createElement } from "react";
import { useTokenPagination } from "./use-token-pagination";
import { TokenData, PaginationMeta } from "@/lib/types";
import * as tokensQuery from "@/lib/tokens-query";

const makeToken = (id: number): TokenData => ({
  id,
  symbol: `TK${id}`,
  name: `Token ${id}`,
  iconUrl: null,
  isUnderMaintenance: false,
  displayOrder: id,
  networks: [],
});

const makePage = (
  tokens: TokenData[],
  pagination: PaginationMeta
) => ({ data: tokens, pagination });

function wrapper() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const Wrapper = ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client }, children);
  Wrapper.displayName = "QueryWrapper";
  return Wrapper;
}

describe("useTokenPagination", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns empty allTokens while loading", () => {
    vi.spyOn(tokensQuery, "fetchTokensPage").mockResolvedValue(
      makePage([], { page: 1, hasNextPage: false })
    );
    const { result } = renderHook(() => useTokenPagination(10), { wrapper: wrapper() });
    expect(result.current.allTokens).toEqual([]);
  });

  it("populates allTokens after fetch resolves", async () => {
    const page = makePage([makeToken(1), makeToken(2)], { page: 1, hasNextPage: false });
    vi.spyOn(tokensQuery, "fetchTokensPage").mockResolvedValue(page);

    const { result } = renderHook(() => useTokenPagination(10), { wrapper: wrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.allTokens).toHaveLength(2);
  });

  it("deduplicates tokens with same id across pages", async () => {
    const page1 = makePage([makeToken(1), makeToken(2)], { page: 1, hasNextPage: true });
    const page2 = makePage([makeToken(2), makeToken(3)], { page: 2, hasNextPage: false });

    vi.spyOn(tokensQuery, "fetchTokensPage")
      .mockResolvedValueOnce(page1)
      .mockResolvedValueOnce(page2);

    const { result } = renderHook(() => useTokenPagination(10), { wrapper: wrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    act(() => result.current.loadMore());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const ids = result.current.allTokens.map((t) => t.id);
    expect(ids).toEqual([1, 2, 3]);
  });

  it("reflects hasNextPage from last page", async () => {
    const page = makePage([makeToken(1)], { page: 1, hasNextPage: true });
    vi.spyOn(tokensQuery, "fetchTokensPage").mockResolvedValue(page);

    const { result } = renderHook(() => useTokenPagination(10), { wrapper: wrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.pagination.hasNextPage).toBe(true);
  });

  it("defaults pagination when no data", () => {
    vi.spyOn(tokensQuery, "fetchTokensPage").mockResolvedValue(
      makePage([], { page: 1, hasNextPage: false })
    );
    const { result } = renderHook(() => useTokenPagination(10), { wrapper: wrapper() });
    expect(result.current.pagination).toEqual({ page: 1, hasNextPage: false });
  });

  it("search triggers refetch with new query", async () => {
    const spy = vi.spyOn(tokensQuery, "fetchTokensPage").mockResolvedValue(
      makePage([], { page: 1, hasNextPage: false })
    );

    const { result } = renderHook(() => useTokenPagination(10), { wrapper: wrapper() });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => result.current.search("btc"));
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const calls = spy.mock.calls;
    expect(calls.some((c) => c[2] === "btc")).toBe(true);
  });

  it("sets error when fetch fails", async () => {
    vi.spyOn(tokensQuery, "fetchTokensPage").mockRejectedValue(new Error("fail"));

    const { result } = renderHook(() => useTokenPagination(10), { wrapper: wrapper() });

    await waitFor(() => expect(result.current.error).not.toBeNull());
    expect(result.current.error?.message).toBe("fail");
  });
});
