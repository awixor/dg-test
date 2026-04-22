import { DepositModalView } from "./deposit-modal-view";
import { getActiveTokensWithCount, DEFAULT_LIMIT } from "@/data/tokens";

export async function DepositModal() {
  const { tokens, pagination } = await getActiveTokensWithCount(1, DEFAULT_LIMIT);

  return <DepositModalView tokens={tokens} initialPagination={pagination} />;
}
