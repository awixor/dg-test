"use client";

import { useState } from "react";
import { TokenData, PaginationMeta } from "@/lib/types";

export function useTokenPagination(
  initialTokens: TokenData[],
  initialPagination: PaginationMeta,
) {
  const [allTokens, setAllTokens] = useState<TokenData[]>(initialTokens);
  const [pagination, setPagination] = useState<PaginationMeta>(initialPagination);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState<string | null>(null);

  const loadMore = async () => {
    if (!pagination.hasNextPage || isLoadingMore) return;
    setIsLoadingMore(true);
    setLoadMoreError(null);
    try {
      const res = await fetch(
        `/api/tokens?page=${pagination.page + 1}&limit=${pagination.limit}`,
      );
      if (!res.ok) throw new Error("Failed to load more tokens");
      const json = await res.json();
      setAllTokens((prev) => [...prev, ...json.data]);
      setPagination(json.pagination);
    } catch {
      setLoadMoreError("Failed to load more tokens. Please try again.");
    } finally {
      setIsLoadingMore(false);
    }
  };

  return { allTokens, pagination, isLoadingMore, loadMoreError, loadMore };
}
