"use client";

import { type Category } from "@/app/(main)/dashboard/page";
import { Globe, Stethoscope, HeartPulse } from "lucide-react";

interface CategorySelectorProps {
  value: Category;
  onChange: (value: Category) => void;
  disabled?: boolean;
}

const CATEGORIES: {
  value: Category;
  label: string;
  sublabel?: string;
  icon: React.ReactNode;
  description: string;
}[] = [
  {
    value: "무역통상",
    label: "무역통상",
    icon: <Globe className="w-4 h-4" />,
    description: "무역·통상·관세·FTA 관련 뉴스",
  },
  {
    value: "디지털헬스케어",
    label: "디지털헬스케어",
    sublabel: "제약·의료기기·화장품",
    icon: <HeartPulse className="w-4 h-4" />,
    description: "디지털 헬스케어, 제약, 의료기기, 화장품 산업 뉴스",
  },
  {
    value: "의료서비스",
    label: "의료서비스",
    icon: <Stethoscope className="w-4 h-4" />,
    description: "의료기관·보건의료 정책·의료수가 관련 뉴스",
  },
];

export function CategorySelector({ value, onChange, disabled }: CategorySelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#94A3B8] mb-2">
        분야 선택
      </label>
      <div className="grid grid-cols-1 gap-2">
        {CATEGORIES.map((cat) => {
          const isSelected = value === cat.value;
          return (
            <button
              key={cat.value}
              type="button"
              onClick={() => !disabled && onChange(cat.value)}
              disabled={disabled}
              className={`
                flex items-center gap-3 p-3 rounded-xl border text-left transition-all
                ${isSelected
                  ? "border-violet-500/60 bg-violet-500/10 text-white"
                  : "border-[#1E1E2E] bg-[#0A0A0F] text-[#94A3B8] hover:border-violet-500/30 hover:text-white hover:bg-violet-500/5"
                }
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
              style={
                isSelected
                  ? { boxShadow: "0 0 0 1px rgba(124,58,237,0.4), 0 0 12px rgba(124,58,237,0.1)" }
                  : {}
              }
            >
              <div
                className={`
                  flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors
                  ${isSelected ? "bg-violet-500/20 text-violet-400" : "bg-[#1E1E2E] text-[#64748B]"}
                `}
              >
                {cat.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{cat.label}</span>
                  {cat.sublabel && (
                    <span className="text-xs text-[#64748B] truncate">/ {cat.sublabel}</span>
                  )}
                </div>
                <p className="text-xs text-[#64748B] mt-0.5 truncate">{cat.description}</p>
              </div>
              {isSelected && (
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
