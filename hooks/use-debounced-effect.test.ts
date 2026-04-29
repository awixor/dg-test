import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useDebouncedEffect } from "./use-debounced-effect";

describe("useDebouncedEffect", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("does not call fn before delay elapses", () => {
    const fn = vi.fn();
    renderHook(() => useDebouncedEffect("a", 300, fn));
    vi.advanceTimersByTime(299);
    expect(fn).not.toHaveBeenCalled();
  });

  it("calls fn after delay with current value", () => {
    const fn = vi.fn();
    renderHook(() => useDebouncedEffect("hello", 300, fn));
    vi.advanceTimersByTime(300);
    expect(fn).toHaveBeenCalledOnce();
    expect(fn).toHaveBeenCalledWith("hello");
  });

  it("cancels previous timer when value changes before delay", () => {
    const fn = vi.fn();
    const { rerender } = renderHook(
      ({ value }: { value: string }) => useDebouncedEffect(value, 300, fn),
      { initialProps: { value: "a" } }
    );
    vi.advanceTimersByTime(200);
    rerender({ value: "b" });
    vi.advanceTimersByTime(200);
    // not enough time after second render
    expect(fn).not.toHaveBeenCalled();
    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledOnce();
    expect(fn).toHaveBeenCalledWith("b");
  });

  it("clears timer on unmount", () => {
    const fn = vi.fn();
    const { unmount } = renderHook(() => useDebouncedEffect("x", 300, fn));
    vi.advanceTimersByTime(200);
    unmount();
    vi.advanceTimersByTime(300);
    expect(fn).not.toHaveBeenCalled();
  });
});
