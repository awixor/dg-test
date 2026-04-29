import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useRef } from "react";
import { useClickOutside } from "./use-click-outside";

function fireMousedown(target: EventTarget) {
  document.dispatchEvent(new MouseEvent("mousedown", { bubbles: true, target } as MouseEventInit));
}

describe("useClickOutside", () => {
  it("calls handler when click is outside the ref element", () => {
    const handler = vi.fn();
    const outside = document.createElement("div");

    renderHook(() => {
      const ref = useRef<HTMLDivElement>(document.createElement("div"));
      useClickOutside(ref, handler);
      return ref;
    });

    fireMousedown(outside);
    expect(handler).toHaveBeenCalledOnce();
  });

  it("does not call handler when click is inside the ref element", () => {
    const handler = vi.fn();
    const el = document.createElement("div");
    document.body.appendChild(el);

    const { unmount } = renderHook(() => {
      const ref = useRef<HTMLDivElement>(el);
      useClickOutside(ref, handler);
      return ref;
    });

    // dispatch event ON the element so event.target === el, which is contained
    el.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    expect(handler).not.toHaveBeenCalled();

    unmount();
    document.body.removeChild(el);
  });

  it("does not register listener when enabled is false", () => {
    const handler = vi.fn();
    const outside = document.createElement("div");

    renderHook(() => {
      const ref = useRef<HTMLDivElement>(document.createElement("div"));
      useClickOutside(ref, handler, false);
      return ref;
    });

    fireMousedown(outside);
    expect(handler).not.toHaveBeenCalled();
  });

  it("removes listener on unmount", () => {
    const handler = vi.fn();
    const outside = document.createElement("div");

    const { unmount } = renderHook(() => {
      const ref = useRef<HTMLDivElement>(document.createElement("div"));
      useClickOutside(ref, handler);
      return ref;
    });

    unmount();
    fireMousedown(outside);
    expect(handler).not.toHaveBeenCalled();
  });

  it("re-registers listener when enabled changes to true", () => {
    const handler = vi.fn();
    const outside = document.createElement("div");

    const { rerender } = renderHook(
      ({ enabled }: { enabled: boolean }) => {
        const ref = useRef<HTMLDivElement>(document.createElement("div"));
        useClickOutside(ref, handler, enabled);
        return ref;
      },
      { initialProps: { enabled: false } }
    );

    fireMousedown(outside);
    expect(handler).not.toHaveBeenCalled();

    rerender({ enabled: true });
    fireMousedown(outside);
    expect(handler).toHaveBeenCalledOnce();
  });
});
