import { useEffect } from "react";

export function useDebouncedEffect<T>(
  value: T,
  delayMs: number,
  fn: (value: T) => void,
) {
  useEffect(() => {
    const timer = setTimeout(() => fn(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]); // eslint-disable-line react-hooks/exhaustive-deps
}
