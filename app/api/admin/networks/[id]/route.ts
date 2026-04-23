import { revalidateTag } from "next/cache";
import { db } from "@/lib/db";

export async function GET(
  _req: Request,
  ctx: RouteContext<"/api/admin/networks/[id]">,
) {
  const { id } = await ctx.params;
  const numId = Number(id);
  if (!Number.isInteger(numId)) {
    return Response.json({ error: "Invalid id" }, { status: 400 });
  }

  try {
    const network = await db.network.findUnique({ where: { id: numId } });

    if (!network) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json({ data: network });
  } catch (err) {
    console.error(`GET /api/admin/networks/${id} failed:`, err);
    return Response.json({ error: "Failed to fetch network" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  ctx: RouteContext<"/api/admin/networks/[id]">,
) {
  const { id } = await ctx.params;
  const numId = Number(id);
  if (!Number.isInteger(numId)) {
    return Response.json({ error: "Invalid id" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { name, slug, iconUrl } = body;

    const network = await db.network.update({
      where: { id: numId },
      data: { name, slug, iconUrl },
    });

    revalidateTag("tokens:list", { expire: 0 });
    return Response.json({ data: network });
  } catch (err) {
    console.error(`PUT /api/admin/networks/${id} failed:`, err);
    return Response.json(
      { error: "Failed to update network" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _req: Request,
  ctx: RouteContext<"/api/admin/networks/[id]">,
) {
  const { id } = await ctx.params;
  const numId = Number(id);
  if (!Number.isInteger(numId)) {
    return Response.json({ error: "Invalid id" }, { status: 400 });
  }

  try {
    await db.network.delete({ where: { id: numId } });
    revalidateTag("tokens:list", { expire: 0 });
    return new Response(null, { status: 204 });
  } catch (err) {
    console.error(`DELETE /api/admin/networks/${id} failed:`, err);
    return Response.json(
      { error: "Failed to delete network" },
      { status: 500 },
    );
  }
}
