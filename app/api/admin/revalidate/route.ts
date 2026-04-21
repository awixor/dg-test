import { revalidateTag } from "next/cache";

const ADMIN_SECRET = process.env.ADMIN_SECRET;

export async function POST(request: Request) {
  if (ADMIN_SECRET) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${ADMIN_SECRET}`) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const { tag } = await request.json().catch(() => ({ tag: "tokens" }));
  const validTags = ["tokens"] as const;

  if (!validTags.includes(tag)) {
    return Response.json({ error: "Invalid tag" }, { status: 400 });
  }

  revalidateTag(tag, { expire: 0 });
  return Response.json({ revalidated: true, tag });
}
