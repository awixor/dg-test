"use client";

export enum Tab {
  Balance = "balance",
  Deposit = "deposit",
  Withdraw = "withdraw",
}

const TABS: { key: Tab; label: string }[] = [
  { key: Tab.Balance, label: "Balance" },
  { key: Tab.Deposit, label: "Deposit" },
  { key: Tab.Withdraw, label: "Withdraw" },
];

interface TabBarProps {
  activeTab: Tab;
  onChange: (tab: Tab) => void;
}

export function TabBar({ activeTab, onChange }: TabBarProps) {
  return (
    <div className="bg-modal-dark rounded-md p-1 flex gap-1 h-9.5">
      {TABS.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`flex-1 rounded-[3px] text-sm font-bold cursor-pointer transition-colors duration-150 ${
            activeTab === tab.key
              ? "bg-modal-bg text-white"
              : "text-modal-muted hover:text-white"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
