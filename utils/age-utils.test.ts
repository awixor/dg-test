import { describe, it, expect } from "vitest";
import { User, UserUtils } from "./age-utils";

const u = (age: number): User => ({ id: 0, name: "", age });

describe("AtLeastTwice", () => {
  it("returns true when oldest is exactly 2x youngest", () => {
    expect(UserUtils.AtLeastTwice([u(20), u(40)])).toBe(true);
  });

  it("returns true when oldest is more than 2x youngest", () => {
    expect(UserUtils.AtLeastTwice([u(20), u(50)])).toBe(true);
  });

  it("returns false when no user is 2x older", () => {
    expect(UserUtils.AtLeastTwice([u(20), u(30), u(39)])).toBe(false);
  });

  it("returns false for single user", () => {
    expect(UserUtils.AtLeastTwice([u(40)])).toBe(false);
  });

  it("returns false for empty array", () => {
    expect(UserUtils.AtLeastTwice([])).toBe(false);
  });

  it("handles all same age", () => {
    expect(UserUtils.AtLeastTwice([u(30), u(30), u(30)])).toBe(false);
  });
});

describe("ExactlyTwice", () => {
  it("returns true for exact double pair", () => {
    expect(UserUtils.ExactlyTwice([u(20), u(40)])).toBe(true);
  });

  it("returns true when pair is not adjacent", () => {
    expect(UserUtils.ExactlyTwice([u(20), u(35), u(40)])).toBe(true);
  });

  it("returns false when no exact double exists", () => {
    expect(UserUtils.ExactlyTwice([u(20), u(41)])).toBe(false);
  });

  it("returns false for single user", () => {
    expect(UserUtils.ExactlyTwice([u(40)])).toBe(false);
  });

  it("returns false for empty array", () => {
    expect(UserUtils.ExactlyTwice([])).toBe(false);
  });

  it("returns false when older is not exactly double (at-least case)", () => {
    expect(UserUtils.ExactlyTwice([u(20), u(50)])).toBe(false);
  });

  it("handles odd age with no exact half", () => {
    expect(UserUtils.ExactlyTwice([u(21), u(42)])).toBe(true);
  });
});

describe("ConstrainedExactlyTwice", () => {
  it("returns true for exact double pair within bounds", () => {
    expect(UserUtils.ConstrainedExactlyTwice([u(20), u(40)])).toBe(true);
  });

  it("returns true for pair at age boundaries (18 and 36)", () => {
    expect(UserUtils.ConstrainedExactlyTwice([u(18), u(36)])).toBe(true);
  });

  it("returns true for pair at upper boundary (40 and 80)", () => {
    expect(UserUtils.ConstrainedExactlyTwice([u(40), u(80)])).toBe(true);
  });

  it("returns false when no exact double within bounds", () => {
    expect(UserUtils.ConstrainedExactlyTwice([u(20), u(41)])).toBe(false);
  });

  it("returns false for single user", () => {
    expect(UserUtils.ConstrainedExactlyTwice([u(40)])).toBe(false);
  });

  it("returns false for empty array", () => {
    expect(UserUtils.ConstrainedExactlyTwice([])).toBe(false);
  });

  it("returns false when double would exceed 80 and no half exists", () => {
    expect(UserUtils.ConstrainedExactlyTwice([u(50), u(79)])).toBe(false);
  });

  it("handles pair where older appears first", () => {
    expect(UserUtils.ConstrainedExactlyTwice([u(40), u(20)])).toBe(true);
  });
});
