import "server-only";

import { cacheTag, cacheLife } from "next/cache";
import { db } from "@/lib/db";
import { PaginationMeta } from "@/lib/types";

export const DEFAULT_LIMIT = 5;
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

const tokenSelect = {
  id: true,
  symbol: true,
  name: true,
  iconUrl: true,
  isUnderMaintenance: true,
  displayOrder: true,
  networks: {
    where: { isActive: true },
    orderBy: { network: { name: "asc" as const } },
    select: {
      depositAddress: true,
      minDeposit: true,
      network: {
        select: { id: true, name: true, slug: true, iconUrl: true },
      },
    },
  },
} as const;

type TokenRow = {
  id: number;
  symbol: string;
  name: string;
  iconUrl: string | null;
  isUnderMaintenance: boolean;
  displayOrder: number;
  networks: {
    depositAddress: string;
    minDeposit: { toString(): string };
    network: { id: number; name: string; slug: string; iconUrl: string | null };
  }[];
};

function serializeTokens(rows: TokenRow[]) {
  return rows.map((token) => ({
    ...token,
    networks: token.networks.map((n) => ({
      ...n,
      minDeposit: n.minDeposit.toString(),
    })),
  }));
}

async function queryTokensPaged(page: number, limit: number) {
  const where = { isEnabled: true };

  const [rows, total] = await db.$transaction([
    db.token.findMany({
      where,
      orderBy: { displayOrder: "asc" },
      skip: (page - 1) * limit,
      take: limit,
      select: tokenSelect,
    }),
    db.token.count({ where }),
  ]);

  return {
    tokens: serializeTokens(rows),
    pagination: buildPaginationMeta(page, limit, total),
  };
}

async function queryTokensSearch(page: number, limit: number, search: string) {
  const where = {
    isEnabled: true,
    OR: [
      { symbol: { contains: search, mode: "insensitive" as const } },
      { name: { contains: search, mode: "insensitive" as const } },
    ],
  };

  const rows = await db.token.findMany({
    where,
    orderBy: { displayOrder: "asc" },
    skip: (page - 1) * limit,
    take: limit + 1,
    select: tokenSelect,
  });

  const hasNextPage = rows.length > limit;
  const page_rows = hasNextPage ? rows.slice(0, limit) : rows;
  const approxTotal =
    (page - 1) * limit + page_rows.length + (hasNextPage ? 1 : 0);

  return {
    tokens: serializeTokens(page_rows),
    pagination: {
      page,
      limit,
      total: approxTotal,
      totalPages: hasNextPage ? page + 1 : page,
      hasNextPage,
    } satisfies PaginationMeta,
  };
}

async function getCachedTokensPage(page: number, limit: number) {
  "use cache";
  cacheLife("hours");
  cacheTag("tokens:list", "tokens:count");
  return queryTokensPaged(page, limit);
}

export async function getActiveTokensWithCount(
  page: number,
  limit: number,
  search?: string,
) {
  if (search) return queryTokensSearch(page, limit, search);
  return getCachedTokensPage(page, limit);
}
