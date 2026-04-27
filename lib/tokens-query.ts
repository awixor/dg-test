import { TokenData, PaginationMeta } from "@/lib/types";

export type TokensPage = {
  data: TokenData[];
  pagination: PaginationMeta;
};

export function tokensQueryKey(search: string, limit: number) {
  return ["tokens", { search, limit }] as const;
}

export async function fetchTokensPage(
  page: number,
  limit: number,
  search: string,
  signal?: AbortSignal,
): Promise<TokensPage> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    ...(search ? { search } : {}),
  });
  const res = await fetch(`/api/tokens?${params}`, { signal });
  if (!res.ok) throw new Error("Failed to load tokens");
  return res.json();
}
