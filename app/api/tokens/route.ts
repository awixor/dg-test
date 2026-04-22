import { getActiveTokens, countActiveTokens, DEFAULT_LIMIT, MAX_LIMIT } from "@/data/tokens";

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

  try {
    const [tokens, total] = await Promise.all([
      getActiveTokens(page, limit),
      countActiveTokens(),
    ]);

    return Response.json({
      data: tokens,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
      },
    });
  } catch {
    return Response.json({ error: "Failed to fetch tokens" }, { status: 500 });
  }
}
