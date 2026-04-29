import { describe, it, expect, vi, beforeEach } from "vitest";
import { tokensQueryKey, fetchTokensPage } from "./tokens-query";

describe("tokensQueryKey", () => {
  it("includes search and limit", () => {
    expect(tokensQueryKey("btc", 10)).toEqual(["tokens", { search: "btc", limit: 10 }]);
  });

  it("works with empty search", () => {
    expect(tokensQueryKey("", 20)).toEqual(["tokens", { search: "", limit: 20 }]);
  });
});

describe("fetchTokensPage", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("calls correct URL with all params", async () => {
    const mockData = { data: [], pagination: { page: 1, hasNextPage: false } };
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve(mockData) })
    );

    await fetchTokensPage(2, 10, "eth");

    expect(fetch).toHaveBeenCalledWith(
      "/api/tokens?page=2&limit=10&search=eth",
      expect.objectContaining({})
    );
  });

  it("omits search param when empty", async () => {
    const mockData = { data: [], pagination: { page: 1, hasNextPage: false } };
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve(mockData) })
    );

    await fetchTokensPage(1, 5, "");

    const url = (fetch as ReturnType<typeof vi.fn>).mock.calls[0][0] as string;
    expect(url).not.toContain("search");
    expect(url).toContain("page=1");
    expect(url).toContain("limit=5");
  });

  it("returns parsed json on success", async () => {
    const mockData = { data: [{ id: 1 }], pagination: { page: 1, hasNextPage: true } };
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve(mockData) })
    );

    const result = await fetchTokensPage(1, 10, "");
    expect(result).toEqual(mockData);
  });

  it("throws on non-ok response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false })
    );

    await expect(fetchTokensPage(1, 10, "")).rejects.toThrow("Failed to load tokens");
  });

  it("forwards AbortSignal", async () => {
    const mockData = { data: [], pagination: { page: 1, hasNextPage: false } };
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve(mockData) })
    );
    const controller = new AbortController();

    await fetchTokensPage(1, 10, "", controller.signal);

    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ signal: controller.signal })
    );
  });
});
