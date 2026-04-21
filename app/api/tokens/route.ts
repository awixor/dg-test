import { cacheTag } from "next/cache";
import { db } from "@/lib/db";

const MAX_LIMIT = 50;
const DEFAULT_LIMIT = 20;

async function getActiveTokens(page: number, limit: number) {
  "use cache";
  cacheTag("tokens");

  return db.token.findMany({
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
}

async function countActiveTokens() {
  "use cache";
  cacheTag("tokens");

  return db.token.count({ where: { isEnabled: true } });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);
  const limit = Math.min(
    MAX_LIMIT,
    Math.max(1, parseInt(searchParams.get("limit") ?? String(DEFAULT_LIMIT), 10) || DEFAULT_LIMIT),
  );

  try {
    const [tokens, total] = await Promise.all([
      getActiveTokens(page, limit),
      countActiveTokens(),
    ]);

    return Response.json({
      data: tokens,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
      },
    });
  } catch {
    return Response.json({ error: "Failed to fetch tokens" }, { status: 500 });
  }
}
