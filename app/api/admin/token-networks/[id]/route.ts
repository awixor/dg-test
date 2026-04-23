import { revalidateTag } from "next/cache";
import { db } from "@/lib/db";

export async function GET(
  _req: Request,
  ctx: RouteContext<"/api/admin/token-networks/[id]">,
) {
  const { id } = await ctx.params;
  const numId = Number(id);
  if (!Number.isInteger(numId)) {
    return Response.json({ error: "Invalid id" }, { status: 400 });
  }

  try {
    const tokenNetwork = await db.tokenNetwork.findUnique({
      where: { id: numId },
      include: { token: true, network: true },
    });

    if (!tokenNetwork)
      return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json({ data: tokenNetwork });
  } catch (err) {
    console.error(`GET /api/admin/token-networks/${id} failed:`, err);
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
  const { id } = await ctx.params;
  const numId = Number(id);
  if (!Number.isInteger(numId)) {
    return Response.json({ error: "Invalid id" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { depositAddress, minDeposit, isActive } = body;

    const tokenNetwork = await db.tokenNetwork.update({
      where: { id: numId },
      data: { depositAddress, minDeposit, isActive },
      include: { token: true, network: true },
    });

    revalidateTag("tokens:list", { expire: 0 });
    return Response.json({ data: tokenNetwork });
  } catch (err) {
    console.error(`PUT /api/admin/token-networks/${id} failed:`, err);
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
  const { id } = await ctx.params;
  const numId = Number(id);
  if (!Number.isInteger(numId)) {
    return Response.json({ error: "Invalid id" }, { status: 400 });
  }

  try {
    await db.tokenNetwork.delete({ where: { id: numId } });
    revalidateTag("tokens:list", { expire: 0 });
    return new Response(null, { status: 204 });
  } catch (err) {
    console.error(`DELETE /api/admin/token-networks/${id} failed:`, err);
    return Response.json(
      { error: "Failed to delete token-network" },
      { status: 500 },
    );
  }
}
