import { revalidateTag } from "next/cache";

const VALID_TAGS = ["tokens:list", "tokens:count"] as const;
type ValidTag = (typeof VALID_TAGS)[number];

export async function POST(request: Request) {
  const { tag } = await request.json().catch(() => ({ tag: null }));

  if (!tag || !VALID_TAGS.includes(tag as ValidTag)) {
    return Response.json(
      { error: `Invalid tag. Allowed: ${VALID_TAGS.join(", ")}` },
      { status: 400 },
    );
  }

  revalidateTag(tag as ValidTag, { expire: 0 });
  return Response.json({ revalidated: true, tag });
}
