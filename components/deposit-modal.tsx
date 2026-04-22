import { DepositModalView } from "./deposit-modal-view";
import { getActiveTokensWithCount, DEFAULT_LIMIT } from "@/data/tokens";
import { connection } from "next/server";

// const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
export async function DepositModal() {
  // await delay(2000);
  await connection();
  const { tokens, pagination } = await getActiveTokensWithCount(
    1,
    DEFAULT_LIMIT,
  );

  return <DepositModalView tokens={tokens} initialPagination={pagination} />;
}
