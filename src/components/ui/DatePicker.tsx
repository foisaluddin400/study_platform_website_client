"use client";

import React, { useState, useRef, useEffect } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from "lucide-react";

interface DatePickerProps {
  label?: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  mode?: "date" | "month-year";
  required?: boolean;
  className?: string;
  helperText?: string;
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function DatePicker({
  label,
  value,
  onChange,
  placeholder = "Select date",
  mode = "date",
  required = false,
  className = "",
  helperText,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Month-Year state
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(() => {
    if (value && mode === "month-year") {
      const match = value.match(/\d{4}/);
      if (match) return parseInt(match[0], 10);
    }
    return currentYear;
  });

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectMonth = (month: string) => {
    const formatted = `${month} ${selectedYear}`;
    onChange(formatted);
    setIsOpen(false);
  };

  return (
    <div className={`space-y-1.5 relative ${className}`} ref={containerRef}>
      {label && (
        <label className="block text-xs font-semibold text-slate-700">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      {mode === "date" ? (
        <div className="relative">
          <input
            type="date"
            value={value ? value.slice(0, 10) : ""}
            onChange={(e) => onChange(e.target.value)}
            required={required}
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all font-medium"
          />
        </div>
      ) : (
        <div>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all flex items-center justify-between font-medium text-left"
          >
            <span className={value ? "text-slate-900" : "text-slate-400"}>
              {value || placeholder}
            </span>
            <CalendarIcon className="w-4 h-4 text-slate-400" />
          </button>

          {isOpen && (
            <div className="absolute z-50 left-0 right-0 sm:right-auto mt-1 max-w-[280px] w-full sm:w-72 p-3 bg-white rounded-2xl border border-slate-200 shadow-xl space-y-3 animate-in fade-in zoom-in-95">
              {/* Year Navigation */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedYear((y) => y - 1)}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-600"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-bold text-xs text-slate-900">{selectedYear}</span>
                <button
                  type="button"
                  onClick={() => setSelectedYear((y) => y + 1)}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-600"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Month Grid */}
              <div className="grid grid-cols-3 gap-1.5">
                {MONTHS.map((m) => {
                  const isSelected = value === `${m} ${selectedYear}`;
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => handleSelectMonth(m)}
                      className={`py-2 px-1 rounded-xl text-xs font-semibold transition-all ${
                        isSelected
                          ? "bg-teal-600 text-white shadow-sm"
                          : "hover:bg-teal-50 hover:text-teal-700 text-slate-700"
                      }`}
                    >
                      {m.slice(0, 3)}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {helperText && <p className="text-[11px] text-slate-500">{helperText}</p>}
    </div>
  );
}
