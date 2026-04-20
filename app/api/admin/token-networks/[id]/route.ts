import { revalidateTag } from "next/cache";
import { db } from "@/lib/db";

export async function GET(
  _req: Request,
  ctx: RouteContext<"/api/admin/token-networks/[id]">,
) {
  try {
    const { id } = await ctx.params;
    const tokenNetwork = await db.tokenNetwork.findUnique({
      where: { id: Number(id) },
      include: { token: true, network: true },
    });

    if (!tokenNetwork)
      return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json({ data: tokenNetwork });
  } catch {
    return Response.json(
      { error: "Failed to fetch token-network" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
  ctx: RouteContext<"/api/admin/token-networks/[id]">,
) {
  try {
    const { id } = await ctx.params;
    const body = await request.json();
    const { depositAddress, minDeposit, isActive } = body;

    const tokenNetwork = await db.tokenNetwork.update({
      where: { id: Number(id) },
      data: { depositAddress, minDeposit, isActive },
      include: { token: true, network: true },
    });

    revalidateTag("tokens", { expire: 0 });
    return Response.json({ data: tokenNetwork });
  } catch {
    return Response.json(
      { error: "Failed to update token-network" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _req: Request,
  ctx: RouteContext<"/api/admin/token-networks/[id]">,
) {
  try {
    const { id } = await ctx.params;
    await db.tokenNetwork.delete({ where: { id: Number(id) } });
    revalidateTag("tokens", { expire: 0 });
    return new Response(null, { status: 204 });
  } catch {
    return Response.json(
      { error: "Failed to delete token-network" },
      { status: 500 },
    );
  }
}
