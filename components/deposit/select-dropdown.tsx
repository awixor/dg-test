"use client";

import { ChevronDown, CheckIcon } from "@/components/icons";
import { ReactNode } from "react";

interface SelectDropdownOption {
  id: string | number;
  label: ReactNode;
  sublabel?: ReactNode;
  icon?: ReactNode;
  badge?: ReactNode;
  isSelected: boolean;
}

interface SelectDropdownProps {
  triggerIcon?: ReactNode;
  triggerLabel?: ReactNode;
  triggerBadge?: ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  options: SelectDropdownOption[];
  onSelect: (id: string | number) => void;
}

export function SelectDropdown({
  triggerIcon,
  triggerLabel,
  triggerBadge,
  isOpen,
  onToggle,
  options,
  onSelect,
}: SelectDropdownProps) {
  return (
    <div className="relative">
      <button
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
        <div className="absolute z-10 mt-1 w-full bg-modal-bg border border-modal-border rounded-[9px] overflow-hidden shadow-xl">
          {options.map((opt) => (
            <button
              key={opt.id}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-modal-hover cursor-pointer transition-colors ${
                opt.isSelected ? "bg-modal-icon-bg" : ""
              }`}
              onClick={() => onSelect(opt.id)}
            >
              {opt.icon}
              <span className="font-medium text-white text-sm flex-1">
                {opt.label}
              </span>
              {opt.sublabel && (
                <span className="text-modal-muted text-xs">{opt.sublabel}</span>
              )}
              {opt.badge}
              {opt.isSelected && (
                <span className="text-white shrink-0">
                  <CheckIcon />
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
