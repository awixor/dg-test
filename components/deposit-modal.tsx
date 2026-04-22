import { DepositModalView } from "./deposit-modal-view";
import { getActiveTokens, countActiveTokens, DEFAULT_LIMIT } from "@/data/tokens";
import { PaginationMeta } from "@/lib/types";

export async function DepositModal() {
  const [tokens, total] = await Promise.all([
    getActiveTokens(1, DEFAULT_LIMIT),
    countActiveTokens(),
  ]);

  const pagination: PaginationMeta = {
    page: 1,
    limit: DEFAULT_LIMIT,
    total,
    totalPages: Math.ceil(total / DEFAULT_LIMIT),
    hasNextPage: DEFAULT_LIMIT < total,
  };

  return <DepositModalView tokens={tokens} initialPagination={pagination} />;
}
