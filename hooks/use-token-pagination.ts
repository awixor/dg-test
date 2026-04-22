"use client";

import { useState, useRef } from "react";
import { TokenData, PaginationMeta } from "@/lib/types";

export function useTokenPagination(
  initialTokens: TokenData[],
  initialPagination: PaginationMeta,
) {
  const [allTokens, setAllTokens] = useState<TokenData[]>(initialTokens);
  const [pagination, setPagination] =
    useState<PaginationMeta>(initialPagination);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const loadMore = async () => {
    if (!pagination.hasNextPage || isLoadingMore) return;

    // Abort any in-flight request (also serves as unmount guard —
    // the signal's abort event prevents state updates on stale fetches)
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    setIsLoadingMore(true);
    setLoadMoreError(null);
    try {
      const res = await fetch(
        `/api/tokens?page=${pagination.page + 1}&limit=${pagination.limit}`,
        { signal: ctrl.signal },
      );
      if (!res.ok) throw new Error("Failed to load more tokens");
      const json = await res.json();

      setAllTokens((prev) => {
        const seen = new Set(prev.map((t) => t.id));
        return [
          ...prev,
          ...json.data.filter((t: TokenData) => !seen.has(t.id)),
        ];
      });
      setPagination(json.pagination);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      setLoadMoreError("Failed to load more tokens. Please try again.");
    } finally {
      if (!ctrl.signal.aborted) setIsLoadingMore(false);
    }
  };

  return { allTokens, pagination, isLoadingMore, loadMoreError, loadMore };
}
