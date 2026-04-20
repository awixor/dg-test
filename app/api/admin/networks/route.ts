import { revalidateTag } from "next/cache";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const networks = await db.network.findMany({ orderBy: { name: "asc" } });
    return Response.json({ data: networks });
  } catch {
    return Response.json({ error: "Failed to fetch networks" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, slug, iconUrl } = body;

    if (!name || !slug) {
      return Response.json({ error: "name and slug are required" }, { status: 400 });
    }

    const network = await db.network.create({ data: { name, slug, iconUrl } });
    revalidateTag("tokens", "max");
    return Response.json({ data: network }, { status: 201 });
  } catch {
    return Response.json({ error: "Failed to create network" }, { status: 500 });
  }
}
