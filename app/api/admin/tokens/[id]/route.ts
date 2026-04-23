import { revalidateTag } from "next/cache";
import { db } from "@/lib/db";

export async function GET(
  _req: Request,
  ctx: RouteContext<"/api/admin/tokens/[id]">,
) {
  const { id } = await ctx.params;
  const numId = Number(id);
  if (!Number.isInteger(numId)) {
    return Response.json({ error: "Invalid id" }, { status: 400 });
  }

  try {
    const token = await db.token.findUnique({
      where: { id: numId },
      include: { networks: { include: { network: true } } },
    });

    if (!token) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json({ data: token });
  } catch (err) {
    console.error(`GET /api/admin/tokens/${id} failed:`, err);
    return Response.json({ error: "Failed to fetch token" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  ctx: RouteContext<"/api/admin/tokens/[id]">,
) {
  const { id } = await ctx.params;
  const numId = Number(id);
  if (!Number.isInteger(numId)) {
    return Response.json({ error: "Invalid id" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const {
      symbol,
      name,
      iconUrl,
      isEnabled,
      isUnderMaintenance,
      displayOrder,
    } = body;

    const token = await db.token.update({
      where: { id: numId },
      data: {
        symbol,
        name,
        iconUrl,
        isEnabled,
        isUnderMaintenance,
        displayOrder,
      },
    });

    revalidateTag("tokens:list", { expire: 0 });
    revalidateTag("tokens:count", { expire: 0 });
    return Response.json({ data: token });
  } catch (err) {
    console.error(`PUT /api/admin/tokens/${id} failed:`, err);
    return Response.json({ error: "Failed to update token" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  ctx: RouteContext<"/api/admin/tokens/[id]">,
) {
  const { id } = await ctx.params;
  const numId = Number(id);
  if (!Number.isInteger(numId)) {
    return Response.json({ error: "Invalid id" }, { status: 400 });
  }

  try {
    await db.token.delete({ where: { id: numId } });
    revalidateTag("tokens:list", { expire: 0 });
    revalidateTag("tokens:count", { expire: 0 });
    return new Response(null, { status: 204 });
  } catch (err) {
    console.error(`DELETE /api/admin/tokens/${id} failed:`, err);
    return Response.json({ error: "Failed to delete token" }, { status: 500 });
  }
}
