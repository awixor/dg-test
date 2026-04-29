"use client";

import { ChevronDown, CheckIcon, SearchIcon } from "@/components/icons";
import { ReactNode, useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useClickOutside } from "@/hooks/use-click-outside";
import { useDebouncedEffect } from "@/hooks/use-debounced-effect";

interface SelectDropdownOption {
  id: number;
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
  onSelect: (id: number) => void;
  hasMore?: boolean;
  isLoading?: boolean;
  onLoadMore?: () => void;
  loadMoreError?: string | null;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
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
  isLoading,
  loadMoreError,
  onLoadMore,
  searchPlaceholder = "Search…",
  onSearch,
}: SelectDropdownProps) {
  const containerRef = useRef<HTMLDivElement>(null);
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
        <DropdownPanel
          options={options}
          onSelect={onSelect}
          hasMore={hasMore}
          isLoading={isLoading}
          loadMoreError={loadMoreError}
          onLoadMore={onLoadMore}
          searchPlaceholder={searchPlaceholder}
          onSearch={onSearch}
        />
      )}
    </div>
  );
}

interface DropdownPanelProps {
  options: SelectDropdownOption[];
  onSelect: (id: number) => void;
  hasMore?: boolean;
  isLoading?: boolean;
  onLoadMore?: () => void;
  loadMoreError?: string | null;
  searchPlaceholder: string;
  onSearch?: (query: string) => void;
}

function DropdownPanel({
  options,
  onSelect,
  hasMore,
  isLoading,
  loadMoreError,
  onLoadMore,
  searchPlaceholder,
  onSearch,
}: DropdownPanelProps) {
  const selectedRef = useRef<HTMLButtonElement>(null);
  const [scrollEl, setScrollEl] = useState<HTMLDivElement | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { ref: sentinelRef } = useInView({
    root: scrollEl,
    threshold: 0,
    rootMargin: "0px 0px 40px 0px",
    onChange: (inView) => {
      if (inView && hasMore && !isLoading && !loadMoreError) onLoadMore?.();
    },
  });

  useEffect(() => {
    selectedRef.current?.scrollIntoView({ block: "nearest" });
    return () => onSearch?.("");
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useDebouncedEffect(searchQuery, 300, (v) => onSearch?.(v));

  return (
    <div
      ref={setScrollEl}
      className="absolute z-10 mt-1 w-full max-h-64 overflow-y-auto bg-modal-bg border border-modal-border rounded-[9px] shadow-xl scrollbar-modal-end"
    >
      {onSearch && (
        <div className="sticky top-0 bg-modal-bg px-3 py-2 border-b border-modal-border">
          <div className="flex items-center gap-2 text-modal-muted">
            <SearchIcon />
            <input
              autoFocus
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className="flex-1 bg-transparent text-sm text-white placeholder:text-modal-muted outline-none"
            />
          </div>
        </div>
      )}
      {isLoading && options.length === 0 && (
        <div className="flex justify-center py-4">
          <span
            role="status"
            aria-label="Loading"
            className="w-4 h-4 rounded-full border-2 border-modal-muted border-t-transparent animate-spin"
          />
        </div>
      )}
      {!isLoading && options.length === 0 && (
        <p className="text-center text-modal-muted text-sm py-4">No results</p>
      )}
      {options.map((option) => (
        <button
          key={option.id}
          ref={option.isSelected ? selectedRef : undefined}
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
            <span className="text-modal-muted text-xs">{option.sublabel}</span>
          )}
          {option.badge}
          {option.isSelected && (
            <span className="text-white shrink-0">
              <CheckIcon />
            </span>
          )}
        </button>
      ))}
      {hasMore && !loadMoreError && options.length > 0 && (
        <div
          ref={sentinelRef}
          className="w-full flex items-center justify-center px-3 py-2 h-8"
        >
          {isLoading && (
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
          <p className="text-xs text-red-400 text-center">{loadMoreError}</p>
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
  );
}
