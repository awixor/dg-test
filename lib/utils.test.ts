import { describe, it, expect } from "vitest";
import { truncateAddress } from "./utils";

describe("truncateAddress", () => {
  it("returns address unchanged when 20 chars or fewer", () => {
    const addr = "a".repeat(20);
    expect(truncateAddress(addr)).toBe(addr);
  });

  it("truncates address longer than 20 chars", () => {
    const addr = "a".repeat(25) + "bcdefg";
    expect(truncateAddress(addr)).toBe(`${"a".repeat(25)}...bcdefg`);
  });

  it("uses first 25 chars and last 6 chars", () => {
    const addr = "123456789012345678901234567890";
    expect(truncateAddress(addr)).toBe("1234567890123456789012345...567890");
  });

  it("returns empty string unchanged", () => {
    expect(truncateAddress("")).toBe("");
  });

  it("returns 21-char address truncated", () => {
    const addr = "a".repeat(21);
    // slice(0, 25) on 21-char string = all 21 chars; slice(-6) = last 6
    expect(truncateAddress(addr)).toBe(`${"a".repeat(21)}...${"a".repeat(6)}`);
  });

  it("exact boundary: 19 chars passes through", () => {
    const addr = "a".repeat(19);
    expect(truncateAddress(addr)).toBe(addr);
  });
});
