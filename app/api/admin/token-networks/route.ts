import { revalidateTag } from "next/cache";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const tokenNetworks = await db.tokenNetwork.findMany({
      include: { token: true, network: true },
      orderBy: [{ tokenId: "asc" }, { networkId: "asc" }],
    });
    return Response.json({ data: tokenNetworks });
  } catch {
    return Response.json(
      { error: "Failed to fetch token-networks" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tokenId, networkId, depositAddress, minDeposit, isActive } = body;

    if (!tokenId || !networkId || !depositAddress || minDeposit == null) {
      return Response.json(
        {
          error:
            "tokenId, networkId, depositAddress, and minDeposit are required",
        },
        { status: 400 },
      );
    }

    const tokenNetwork = await db.tokenNetwork.create({
      data: { tokenId, networkId, depositAddress, minDeposit, isActive },
      include: { token: true, network: true },
    });

    revalidateTag("tokens", { expire: 0 });
    return Response.json({ data: tokenNetwork }, { status: 201 });
  } catch {
    return Response.json(
      { error: "Failed to create token-network" },
      { status: 500 },
    );
  }
}
