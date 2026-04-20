import { cacheTag } from "next/cache";
import { db } from "@/lib/db";

async function getActiveTokens() {
  "use cache";
  cacheTag("tokens");

  return db.token.findMany({
    where: { isEnabled: true },
    orderBy: { displayOrder: "asc" },
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

export async function GET() {
  try {
    const tokens = await getActiveTokens();
    return Response.json({ data: tokens });
  } catch {
    return Response.json({ error: "Failed to fetch tokens" }, { status: 500 });
  }
}
