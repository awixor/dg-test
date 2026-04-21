import { revalidateTag } from "next/cache";

export async function POST(request: Request) {
  const { tag } = await request.json().catch(() => ({ tag: "tokens" }));
  const validTags = ["tokens"] as const;

  if (!validTags.includes(tag)) {
    return Response.json({ error: "Invalid tag" }, { status: 400 });
  }

  revalidateTag(tag, { expire: 0 });
  return Response.json({ revalidated: true, tag });
}
