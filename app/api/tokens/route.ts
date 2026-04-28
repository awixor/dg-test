import {
  getActiveTokensWithCount,
  DEFAULT_LIMIT,
  MAX_LIMIT,
} from "@/lib/tokens-server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);
  const limit = Math.min(
    MAX_LIMIT,
    Math.max(
      1,
      parseInt(searchParams.get("limit") ?? String(DEFAULT_LIMIT), 10) ||
        DEFAULT_LIMIT,
    ),
  );
  const search = searchParams.get("search")?.trim() || undefined;

  try {
    const { tokens, pagination } = await getActiveTokensWithCount(
      page,
      limit,
      search,
    );

    return Response.json({
      data: tokens,
      pagination,
    });
  } catch (err) {
    console.error("GET /api/tokens failed:", err);
    return Response.json({ error: "Failed to fetch tokens" }, { status: 500 });
  }
}
