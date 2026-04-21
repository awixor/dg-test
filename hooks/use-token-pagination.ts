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

  const loadMore = async () => {
    if (!pagination.hasNextPage || isLoadingMore) return;
    setIsLoadingMore(true);
    try {
      const res = await fetch(
        `/api/tokens?page=${pagination.page + 1}&limit=${pagination.limit}`,
      );
      if (!res.ok) return;
      const json = await res.json();
      setAllTokens((prev) => [...prev, ...json.data]);
      setPagination(json.pagination);
    } finally {
      setIsLoadingMore(false);
    }
  };

  return { allTokens, pagination, isLoadingMore, loadMore };
}
