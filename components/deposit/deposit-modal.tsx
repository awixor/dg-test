import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { connection } from "next/server";
import { DepositModalView } from "./deposit-modal-view";
import { getActiveTokensWithCount, DEFAULT_LIMIT } from "@/lib/tokens.server";
import { getQueryClient } from "@/lib/get-query-client";
import { tokensQueryKey } from "@/lib/tokens-query";

export async function DepositModal() {
  await connection();

  const queryClient = getQueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: tokensQueryKey("", DEFAULT_LIMIT),
    queryFn: async () => {
      const { tokens, pagination } = await getActiveTokensWithCount(
        1,
        DEFAULT_LIMIT,
      );
      return { data: tokens, pagination };
    },
    initialPageParam: 1,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DepositModalView initialLimit={DEFAULT_LIMIT} />
    </HydrationBoundary>
  );
}
