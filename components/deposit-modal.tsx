import { DepositModalView } from "./deposit-modal-view";
import { getActiveTokensWithCount, DEFAULT_LIMIT } from "@/data/tokens";
import { connection } from "next/server";

export async function DepositModal() {
  await connection();
  const { tokens, pagination } = await getActiveTokensWithCount(
    1,
    DEFAULT_LIMIT,
  );

  return <DepositModalView tokens={tokens} initialPagination={pagination} />;
}
