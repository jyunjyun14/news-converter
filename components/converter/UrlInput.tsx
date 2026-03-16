"use client";

import { Link, X } from "lucide-react";

interface UrlInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function UrlInput({ value, onChange, disabled }: UrlInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#94A3B8] mb-1.5">
        뉴스 기사 URL
      </label>
      <div className="relative group">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B] group-focus-within:text-violet-400 transition-colors">
          <Link className="w-4 h-4" />
        </div>
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder="https://www.example.com/news/article..."
          className="w-full bg-[#0A0A0F] border border-[#1E1E2E] focus:border-[#7C3AED] rounded-xl pl-10 pr-10 py-3 text-white placeholder-[#64748B] text-sm outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            boxShadow: "none",
          }}
          onFocus={(e) => {
            e.currentTarget.style.boxShadow = "0 0 0 1px #7C3AED, 0 0 20px rgba(124,58,237,0.15)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.boxShadow = "none";
          }}
        />
        {value && !disabled && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      <p className="text-xs text-[#64748B] mt-1.5">
        변환하고 싶은 뉴스 기사의 URL을 붙여넣으세요
      </p>
    </div>
  );
}
