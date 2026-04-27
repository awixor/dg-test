"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { TokenData, PaginationMeta } from "@/lib/types";
import { tokensQueryKey, fetchTokensPage, TokensPage } from "@/lib/tokens-query";

export function useTokenPagination(initialLimit: number) {
  const [searchQuery, setSearchQuery] = useState("");

  const query = useInfiniteQuery<TokensPage>({
    queryKey: tokensQueryKey(searchQuery, initialLimit),
    queryFn: ({ pageParam, signal }) =>
      fetchTokensPage(pageParam as number, initialLimit, searchQuery, signal),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNextPage ? lastPage.pagination.page + 1 : undefined,
  });

  const allTokens = useMemo<TokenData[]>(() => {
    if (!query.data) return [];
    const seen = new Set<number>();
    const out: TokenData[] = [];
    for (const page of query.data.pages) {
      for (const token of page.data) {
        if (!seen.has(token.id)) {
          seen.add(token.id);
          out.push(token);
        }
      }
    }
    return out;
  }, [query.data]);

  const lastPage = query.data?.pages[query.data.pages.length - 1];
  const pagination: PaginationMeta = lastPage?.pagination ?? {
    page: 1,
    limit: initialLimit,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
  };

  return {
    allTokens,
    pagination,
    isLoading: query.isFetching,
    error: query.error,
    loadMore: () => {
      if (query.hasNextPage && !query.isFetchingNextPage) query.fetchNextPage();
    },
    search: (q: string) => setSearchQuery(q),
  };
}
