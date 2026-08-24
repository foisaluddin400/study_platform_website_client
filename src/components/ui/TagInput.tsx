"use client";

import React, { useState } from "react";
import { X, Plus } from "lucide-react";

interface TagInputProps {
  label?: string;
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  helperText?: string;
  options?: string[]; // Optional autocomplete dropdown
  className?: string;
}

export function TagInput({
  label,
  tags = [],
  onChange,
  placeholder = "Type and press Enter...",
  helperText,
  options = [],
  className = "",
}: TagInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(inputValue);
    }
  };

  const addTag = (text: string) => {
    const trimmed = text.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
      setInputValue("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter((t) => t !== tagToRemove));
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label className="block text-xs font-semibold text-slate-700">
          {label}
        </label>
      )}

      <div className="min-h-[42px] p-1.5 rounded-xl border border-slate-200 bg-white flex flex-wrap items-center gap-1.5 focus-within:ring-2 focus-within:ring-teal-500/20 focus-within:border-teal-600 transition-all">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="p-0.5 hover:bg-teal-200 rounded-md text-teal-700 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}

        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            if (inputValue.trim()) addTag(inputValue);
          }}
          placeholder={tags.length === 0 ? placeholder : "Add more..."}
          className="flex-1 min-w-[120px] px-2 py-1 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
        />
      </div>

      {/* Suggested Quick Options */}
      {options.length > 0 && (
        <div className="flex flex-wrap items-center gap-1 pt-1">
          <span className="text-[10px] text-slate-400 font-medium mr-1">Suggestions:</span>
          {options
            .filter((opt) => !tags.includes(opt))
            .slice(0, 6)
            .map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => addTag(opt)}
                className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-600 transition-colors font-medium"
              >
                + {opt}
              </button>
            ))}
        </div>
      )}

      {helperText && <p className="text-[11px] text-slate-500">{helperText}</p>}
    </div>
  );
}
