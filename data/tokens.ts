import "server-only";

import { cacheTag } from "next/cache";
import { db } from "@/lib/db";

export const DEFAULT_LIMIT = 2;
export const MAX_LIMIT = 50;

export async function getActiveTokens(page: number, limit: number) {
  "use cache";
  cacheTag("tokens");

  const rows = await db.token.findMany({
    where: { isEnabled: true },
    orderBy: { displayOrder: "asc" },
    skip: (page - 1) * limit,
    take: limit,
    select: {
      id: true,
      symbol: true,
      name: true,
      iconUrl: true,
      isUnderMaintenance: true,
      displayOrder: true,
      networks: {
        where: { isActive: true },
        select: {
          depositAddress: true,
          minDeposit: true,
          network: {
            select: { id: true, name: true, slug: true, iconUrl: true },
          },
        },
      },
    },
  });

  return rows.map((token) => ({
    ...token,
    networks: token.networks.map((n) => ({
      ...n,
      minDeposit: n.minDeposit.toString(),
    })),
  }));
}

export async function countActiveTokens() {
  "use cache";
  cacheTag("tokens");

  return db.token.count({ where: { isEnabled: true } });
}
