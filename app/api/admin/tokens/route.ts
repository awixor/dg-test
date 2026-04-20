import { revalidateTag } from "next/cache";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const tokens = await db.token.findMany({
      orderBy: { displayOrder: "asc" },
      include: {
        networks: {
          include: { network: true },
        },
      },
    });
    return Response.json({ data: tokens });
  } catch {
    return Response.json({ error: "Failed to fetch tokens" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { symbol, name, iconUrl, isEnabled, isUnderMaintenance, displayOrder } = body;

    if (!symbol || !name) {
      return Response.json({ error: "symbol and name are required" }, { status: 400 });
    }

    const token = await db.token.create({
      data: { symbol, name, iconUrl, isEnabled, isUnderMaintenance, displayOrder },
    });

    revalidateTag("tokens", "max");
    return Response.json({ data: token }, { status: 201 });
  } catch {
    return Response.json({ error: "Failed to create token" }, { status: 500 });
  }
}
