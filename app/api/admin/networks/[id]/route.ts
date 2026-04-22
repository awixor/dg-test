import { revalidateTag } from "next/cache";
import { db } from "@/lib/db";

export async function GET(
  _req: Request,
  ctx: RouteContext<"/api/admin/networks/[id]">,
) {
  try {
    const { id } = await ctx.params;
    const network = await db.network.findUnique({ where: { id: Number(id) } });

    if (!network) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json({ data: network });
  } catch (err) {
    console.error(`GET /api/admin/networks/${(await ctx.params).id} failed:`, err);
    return Response.json({ error: "Failed to fetch network" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  ctx: RouteContext<"/api/admin/networks/[id]">,
) {
  try {
    const { id } = await ctx.params;
    const body = await request.json();
    const { name, slug, iconUrl } = body;

    const network = await db.network.update({
      where: { id: Number(id) },
      data: { name, slug, iconUrl },
    });

    revalidateTag("tokens:list", { expire: 0 });
    return Response.json({ data: network });
  } catch (err) {
    console.error(`PUT /api/admin/networks/${(await ctx.params).id} failed:`, err);
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
  try {
    const { id } = await ctx.params;
    await db.network.delete({ where: { id: Number(id) } });
    revalidateTag("tokens:list", { expire: 0 });
    return new Response(null, { status: 204 });
  } catch (err) {
    console.error(`DELETE /api/admin/networks/${(await ctx.params).id} failed:`, err);
    return Response.json(
      { error: "Failed to delete network" },
      { status: 500 },
    );
  }
}
