import { DepositModalView } from "./deposit-modal-view";
import { TokenData, PaginationMeta } from "@/lib/types";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ??
  `http://localhost:${process.env.PORT ?? 3000}`;

async function fetchTokens(): Promise<{ tokens: TokenData[]; pagination: PaginationMeta }> {
  const res = await fetch(`${BASE_URL}/api/tokens`, {
    next: { tags: ["tokens"] },
  });

  if (!res.ok) throw new Error("Failed to fetch tokens");

  const json = await res.json();
  return { tokens: json.data, pagination: json.pagination };
}

export async function DepositModal() {
  const { tokens, pagination } = await fetchTokens();

  return <DepositModalView tokens={tokens} initialPagination={pagination} />;
}
