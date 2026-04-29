import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("next/cache", () => ({
  cacheLife: vi.fn(),
  cacheTag: vi.fn(),
}));
vi.mock("@/lib/db", () => ({
  db: {
    token: {
      findMany: vi.fn(),
      count: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

import { getActiveTokensWithCount, DEFAULT_LIMIT, MAX_LIMIT } from "./tokens-server";
import { db } from "@/lib/db";

const mockDb = db as unknown as {
  token: { findMany: ReturnType<typeof vi.fn>; count: ReturnType<typeof vi.fn> };
  $transaction: ReturnType<typeof vi.fn>;
};

const makeRow = (id: number, minDeposit: object = { toString: () => "0.001" }) => ({
  id,
  symbol: `TK${id}`,
  name: `Token ${id}`,
  iconUrl: null,
  isUnderMaintenance: false,
  displayOrder: id,
  networks: [
    {
      depositAddress: `addr-${id}`,
      minDeposit,
      network: { id: 10, name: "Ethereum", slug: "eth", iconUrl: null },
    },
  ],
});

describe("DEFAULT_LIMIT / MAX_LIMIT", () => {
  it("DEFAULT_LIMIT is 5", () => expect(DEFAULT_LIMIT).toBe(5));
  it("MAX_LIMIT is 50", () => expect(MAX_LIMIT).toBe(50));
});

describe("getActiveTokensWithCount — no search (paged)", () => {
  beforeEach(() => vi.clearAllMocks());

  it("uses $transaction for paged query", async () => {
    mockDb.$transaction.mockResolvedValue([[makeRow(1)], 1]);
    await getActiveTokensWithCount(1, 5);
    expect(mockDb.$transaction).toHaveBeenCalledOnce();
  });

  it("hasNextPage true when more rows remain", async () => {
    // page=1, limit=5, total=10 → page*limit(5) < total(10) → true
    mockDb.$transaction.mockResolvedValue([[makeRow(1)], 10]);
    const result = await getActiveTokensWithCount(1, 5);
    expect(result.pagination.hasNextPage).toBe(true);
  });

  it("hasNextPage false when on last page", async () => {
    // page=2, limit=5, total=10 → 2*5=10, not < 10 → false
    mockDb.$transaction.mockResolvedValue([[makeRow(1)], 10]);
    const result = await getActiveTokensWithCount(2, 5);
    expect(result.pagination.hasNextPage).toBe(false);
  });

  it("serializes minDeposit via .toString()", async () => {
    const row = makeRow(1, { toString: () => "1.23456789" });
    mockDb.$transaction.mockResolvedValue([[row], 1]);
    const result = await getActiveTokensWithCount(1, 5);
    expect(result.tokens[0].networks[0].minDeposit).toBe("1.23456789");
  });

  it("returns correct page in pagination meta", async () => {
    mockDb.$transaction.mockResolvedValue([[makeRow(1)], 1]);
    const result = await getActiveTokensWithCount(3, 5);
    expect(result.pagination.page).toBe(3);
  });

  it("returns empty tokens when no rows", async () => {
    mockDb.$transaction.mockResolvedValue([[], 0]);
    const result = await getActiveTokensWithCount(1, 5);
    expect(result.tokens).toHaveLength(0);
    expect(result.pagination.hasNextPage).toBe(false);
  });
});

describe("getActiveTokensWithCount — with search", () => {
  beforeEach(() => vi.clearAllMocks());

  it("uses findMany (not $transaction) for search", async () => {
    mockDb.token.findMany.mockResolvedValue([makeRow(1)]);
    await getActiveTokensWithCount(1, 5, "btc");
    expect(mockDb.token.findMany).toHaveBeenCalledOnce();
    expect(mockDb.$transaction).not.toHaveBeenCalled();
  });

  it("requests limit+1 rows to detect next page", async () => {
    mockDb.token.findMany.mockResolvedValue([]);
    await getActiveTokensWithCount(1, 5, "eth");
    const call = mockDb.token.findMany.mock.calls[0][0];
    expect(call.take).toBe(6); // limit + 1
  });

  it("hasNextPage true when rows.length > limit", async () => {
    // limit=5, return 6 rows → hasNextPage
    const rows = Array.from({ length: 6 }, (_, i) => makeRow(i + 1));
    mockDb.token.findMany.mockResolvedValue(rows);
    const result = await getActiveTokensWithCount(1, 5, "tok");
    expect(result.pagination.hasNextPage).toBe(true);
  });

  it("hasNextPage false when rows.length <= limit", async () => {
    const rows = Array.from({ length: 5 }, (_, i) => makeRow(i + 1));
    mockDb.token.findMany.mockResolvedValue(rows);
    const result = await getActiveTokensWithCount(1, 5, "tok");
    expect(result.pagination.hasNextPage).toBe(false);
  });

  it("slices the extra row off returned tokens when hasNextPage", async () => {
    const rows = Array.from({ length: 6 }, (_, i) => makeRow(i + 1));
    mockDb.token.findMany.mockResolvedValue(rows);
    const result = await getActiveTokensWithCount(1, 5, "tok");
    expect(result.tokens).toHaveLength(5);
  });

  it("does not slice when rows <= limit", async () => {
    const rows = Array.from({ length: 3 }, (_, i) => makeRow(i + 1));
    mockDb.token.findMany.mockResolvedValue(rows);
    const result = await getActiveTokensWithCount(1, 5, "tok");
    expect(result.tokens).toHaveLength(3);
  });

  it("serializes minDeposit via .toString() in search path", async () => {
    const row = makeRow(1, { toString: () => "9.99" });
    mockDb.token.findMany.mockResolvedValue([row]);
    const result = await getActiveTokensWithCount(1, 5, "tok");
    expect(result.tokens[0].networks[0].minDeposit).toBe("9.99");
  });

  it("returns correct page in pagination meta", async () => {
    mockDb.token.findMany.mockResolvedValue([makeRow(1)]);
    const result = await getActiveTokensWithCount(2, 5, "btc");
    expect(result.pagination.page).toBe(2);
  });
});
