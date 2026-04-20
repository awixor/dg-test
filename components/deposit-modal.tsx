import { DepositModalView } from "./deposit-modal-view";
import { TokenData } from "@/lib/types";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ??
  `http://localhost:${process.env.PORT ?? 3000}`;

async function fetchTokens(): Promise<TokenData[]> {
  const res = await fetch(`${BASE_URL}/api/tokens`, {
    next: { tags: ["tokens"] },
  });

  if (!res.ok) throw new Error("Failed to fetch tokens");

  const json = await res.json();
  return json.data;
}

export async function DepositModal() {
  const tokens = await fetchTokens();

  return <DepositModalView tokens={tokens} />;
}
