import { revalidateTag } from "next/cache";
import { db } from "@/lib/db";

export async function GET(
  _req: Request,
  ctx: RouteContext<"/api/admin/tokens/[id]">,
) {
  try {
    const { id } = await ctx.params;
    const token = await db.token.findUnique({
      where: { id: Number(id) },
      include: { networks: { include: { network: true } } },
    });

    if (!token) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json({ data: token });
  } catch {
    return Response.json({ error: "Failed to fetch token" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  ctx: RouteContext<"/api/admin/tokens/[id]">,
) {
  try {
    const { id } = await ctx.params;
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
      where: { id: Number(id) },
      data: {
        symbol,
        name,
        iconUrl,
        isEnabled,
        isUnderMaintenance,
        displayOrder,
      },
    });

    revalidateTag("tokens", "max");
    return Response.json({ data: token });
  } catch {
    return Response.json({ error: "Failed to update token" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  ctx: RouteContext<"/api/admin/tokens/[id]">,
) {
  try {
    const { id } = await ctx.params;
    await db.token.delete({ where: { id: Number(id) } });
    revalidateTag("tokens", "max");
    return new Response(null, { status: 204 });
  } catch {
    return Response.json({ error: "Failed to delete token" }, { status: 500 });
  }
}
