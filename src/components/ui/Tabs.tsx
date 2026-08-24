"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface TabItem {
  id: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  variant?: "underline" | "pills" | "contained";
  className?: string;
}

export function Tabs({
  tabs,
  activeTab,
  onChange,
  variant = "underline",
  className,
}: TabsProps) {
  if (variant === "pills") {
    return (
      <div className={cn("flex flex-nowrap sm:flex-wrap overflow-x-auto gap-1.5 p-1 bg-slate-100/90 rounded-xl scrollbar-none", className)}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={cn(
                "flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0",
                isActive
                  ? "bg-white text-teal-700 shadow-2xs font-semibold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
              )}
            >
              {tab.icon && <span className="shrink-0">{tab.icon}</span>}
              <span>{tab.label}</span>
              {typeof tab.count === "number" && (
                <span
                  className={cn(
                    "px-1.5 py-0.2 rounded-full text-[10px]",
                    isActive ? "bg-teal-50 text-teal-700 font-bold" : "bg-slate-200 text-slate-600"
                  )}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  if (variant === "contained") {
    return (
      <div className={cn("flex border-b border-slate-200 gap-2 overflow-x-auto scrollbar-none", className)}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 text-xs font-medium rounded-t-xl border-t border-x -mb-px transition-all cursor-pointer whitespace-nowrap shrink-0",
                isActive
                  ? "bg-white border-slate-200 text-teal-700 font-semibold border-b-transparent shadow-2xs"
                  : "border-transparent bg-slate-50 text-slate-500 hover:text-slate-800 hover:bg-slate-100"
              )}
            >
              {tab.icon && <span>{tab.icon}</span>}
              <span>{tab.label}</span>
              {typeof tab.count === "number" && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200 text-slate-700">
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  // Default underline style
  return (
    <div className={cn("flex space-x-4 sm:space-x-6 border-b border-slate-200 overflow-x-auto scrollbar-none", className)}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "flex items-center gap-2 py-3 px-1 text-sm font-medium border-b-2 transition-all cursor-pointer whitespace-nowrap",
              isActive
                ? "border-teal-600 text-teal-700 font-semibold"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
            )}
          >
            {tab.icon && <span>{tab.icon}</span>}
            <span>{tab.label}</span>
            {typeof tab.count === "number" && (
              <span
                className={cn(
                  "px-2 py-0.5 rounded-full text-xs",
                  isActive ? "bg-teal-50 text-teal-700 font-bold" : "bg-slate-100 text-slate-600"
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
