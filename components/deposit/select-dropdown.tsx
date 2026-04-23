"use client";

import { ChevronDown, CheckIcon } from "@/components/icons";
import { ReactNode, useEffect, useState, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { useClickOutside } from "@/hooks/use-click-outside";

interface SelectDropdownOption {
  id: string | number;
  label: ReactNode;
  sublabel?: ReactNode;
  icon?: ReactNode;
  badge?: ReactNode;
  isSelected: boolean;
}

interface SelectDropdownProps {
  id?: string;
  triggerIcon?: ReactNode;
  triggerLabel?: ReactNode;
  triggerBadge?: ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  options: SelectDropdownOption[];
  onSelect: (id: string | number) => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
  onLoadMore?: () => void;
  loadMoreError?: string | null;
}

export function SelectDropdown({
  id,
  triggerIcon,
  triggerLabel,
  triggerBadge,
  isOpen,
  onToggle,
  options,
  onSelect,
  hasMore,
  isLoadingMore,
  loadMoreError,
  onLoadMore,
}: SelectDropdownProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollEl, setScrollEl] = useState<HTMLDivElement | null>(null);
  const { ref: sentinelRef, inView } = useInView({
    root: scrollEl,
    threshold: 0,
    rootMargin: "0px 0px 40px 0px",
  });

  useEffect(() => {
    if (!isOpen || !hasMore || isLoadingMore || loadMoreError) return;
    if (inView) onLoadMore?.();
  }, [inView, isOpen, hasMore, isLoadingMore, loadMoreError, onLoadMore]);

  useClickOutside(containerRef, onToggle, isOpen);

  return (
    <div className="relative" ref={containerRef}>
      <button
        id={id}
        type="button"
        className="w-full flex items-center gap-2 bg-modal-bg rounded-md px-2 py-2 hover:bg-modal-hover transition-colors cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
      >
        {triggerIcon}
        <span className="flex-1 text-left text-sm text-modal-muted">
          {triggerLabel}
        </span>
        {triggerBadge}
        <ChevronDown />
      </button>

      {isOpen && (
        <div
          ref={setScrollEl}
          className="absolute z-10 mt-1 w-full max-h-64 overflow-y-auto bg-modal-bg border border-modal-border rounded-[9px] shadow-xl scrollbar-modal-end"
        >
          {options.map((option) => (
            <button
              key={option.id}
              ref={
                option.isSelected
                  ? (element) => element?.scrollIntoView({ block: "nearest" })
                  : undefined
              }
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-modal-hover cursor-pointer transition-colors ${
                option.isSelected ? "bg-modal-icon-bg" : ""
              }`}
              onClick={() => onSelect(option.id)}
            >
              {option.icon}
              <span className="font-medium text-white text-sm flex-1">
                {option.label}
              </span>
              {option.sublabel && (
                <span className="text-modal-muted text-xs">
                  {option.sublabel}
                </span>
              )}
              {option.badge}
              {option.isSelected && (
                <span className="text-white shrink-0">
                  <CheckIcon />
                </span>
              )}
            </button>
          ))}
          {hasMore && !loadMoreError && (
            <div
              ref={sentinelRef}
              className="w-full flex items-center justify-center px-3 py-2 h-8"
              aria-live="polite"
              aria-busy={isLoadingMore}
            >
              {isLoadingMore && (
                <span
                  role="status"
                  aria-label="Loading more"
                  className="w-4 h-4 rounded-full border-2 border-modal-muted border-t-transparent animate-spin"
                />
              )}
            </div>
          )}
          {loadMoreError && (
            <div className="flex flex-col items-center gap-1 py-2">
              <p className="text-xs text-red-400 text-center">
                {loadMoreError}
              </p>
              <button
                className="text-xs text-modal-muted hover:text-white cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  onLoadMore?.();
                }}
              >
                Retry
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
