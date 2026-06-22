"use client";

import { cn } from "@/lib/utils";

interface TabItem {
  key: string;
  label: string;
}

interface TabsProps {
  items: TabItem[];
  activeKey: string;
  onChange: (key: string) => void;
  className?: string;
}

export default function Tabs({ items, activeKey, onChange, className }: TabsProps) {
  return (
    <div className={cn("flex bg-gray rounded-2xl p-1", className)}>
      {items.map((item) => (
        <button
          key={item.key}
          onClick={() => onChange(item.key)}
          className={cn(
            "flex-1 py-3 text-base font-semibold rounded-xl transition-all",
            activeKey === item.key
              ? "bg-white text-secondary shadow-sm"
              : "text-gray-500"
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
