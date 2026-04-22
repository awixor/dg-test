import "server-only";

import { cacheTag, cacheLife } from "next/cache";
import { db } from "@/lib/db";
import { PaginationMeta } from "@/lib/types";

export const DEFAULT_LIMIT = 2;
export const MAX_LIMIT = 50;

export function buildPaginationMeta(
  page: number,
  limit: number,
  total: number,
): PaginationMeta {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    hasNextPage: page * limit < total,
  };
}

export async function getActiveTokensWithCount(page: number, limit: number) {
  "use cache";
  cacheLife("hours");
  cacheTag("tokens:list", "tokens:count");

  const [rows, total] = await db.$transaction([
    db.token.findMany({
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
          orderBy: { network: { name: "asc" } },
          select: {
            depositAddress: true,
            minDeposit: true,
            network: {
              select: { id: true, name: true, slug: true, iconUrl: true },
            },
          },
        },
      },
    }),
    db.token.count({ where: { isEnabled: true } }),
  ]);

  const tokens = rows.map((token) => ({
    ...token,
    networks: token.networks.map((n) => ({
      ...n,
      minDeposit: n.minDeposit.toString(),
    })),
  }));

  return { tokens, pagination: buildPaginationMeta(page, limit, total) };
}
