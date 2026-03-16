"use client";

import { useState, useCallback } from "react";
import { Copy, Check, FileText, ExternalLink } from "lucide-react";
import { type ConversionResult } from "@/app/(main)/dashboard/page";

interface ResultDisplayProps {
  result: ConversionResult | null;
  isLoading: boolean;
}

// Parse [[한화 ...]] markers and return React nodes
function renderResultText(text: string): React.ReactNode[] {
  const parts = text.split(/(\[\[한화[^\]]*\]\])/g);

  return parts.map((part, index) => {
    const match = part.match(/^\[\[(한화[^\]]*)\]\]$/);
    if (match) {
      return (
        <span key={index} className="korean-amount">
          {match[1]}
        </span>
      );
    }
    return <span key={index}>{part}</span>;
  });
}

// Strip [[...]] markers for clipboard copy
function stripMarkers(text: string): string {
  return text.replace(/\[\[(한화[^\]]*)\]\]/g, "$1");
}

const CATEGORY_BADGES: Record<string, { label: string; color: string }> = {
  무역통상: { label: "무역통상", color: "bg-blue-500/15 text-blue-400 border-blue-500/20" },
  디지털헬스케어: { label: "디지털헬스케어", color: "bg-green-500/15 text-green-400 border-green-500/20" },
  의료서비스: { label: "의료서비스", color: "bg-orange-500/15 text-orange-400 border-orange-500/20" },
};

export function ResultDisplay({ result, isLoading }: ResultDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    if (!result) return;
    await navigator.clipboard.writeText(stripMarkers(result.text));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [result]);

  if (isLoading) {
    return (
      <div className="bg-[#12121A] border border-[#1E1E2E] rounded-2xl p-6 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-[#94A3B8] uppercase tracking-wider">
            출력 결과
          </h2>
        </div>
        <div className="flex-1 space-y-3">
          {/* Skeleton loading */}
          <div className="h-5 rounded shimmer-bg w-3/4" />
          <div className="h-4 rounded shimmer-bg w-1/2" />
          <div className="h-px bg-[#1E1E2E] my-4" />
          <div className="h-4 rounded shimmer-bg w-full" />
          <div className="h-4 rounded shimmer-bg w-5/6" />
          <div className="h-4 rounded shimmer-bg w-4/5" />
          <div className="h-4 rounded shimmer-bg w-full" />
          <div className="h-4 rounded shimmer-bg w-3/4" />
          <div className="h-4 rounded shimmer-bg w-5/6" />
          <div className="h-px bg-[#1E1E2E] my-4" />
          <div className="h-4 rounded shimmer-bg w-1/3" />
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs text-[#64748B]">
          <span className="w-3 h-3 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
          Claude가 보고서를 작성하고 있습니다...
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="bg-[#12121A] border border-[#1E1E2E] rounded-2xl p-6 flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-16 h-16 rounded-2xl bg-[#1E1E2E] flex items-center justify-center mb-4">
          <FileText className="w-8 h-8 text-[#2D2D3D]" />
        </div>
        <p className="text-[#64748B] text-sm font-medium">아직 생성된 보고서가 없습니다</p>
        <p className="text-[#4A5568] text-xs mt-1">
          왼쪽에서 URL과 분야를 선택하고 보고서를 생성하세요
        </p>
      </div>
    );
  }

  const badge = CATEGORY_BADGES[result.category];

  return (
    <div className="bg-[#12121A] border border-[#1E1E2E] rounded-2xl p-6 flex flex-col fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-[#94A3B8] uppercase tracking-wider">
            출력 결과
          </h2>
          {badge && (
            <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${badge.color}`}>
              {badge.label}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <a
            href={result.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-[#64748B] hover:text-white transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            원문
          </a>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-[#1E1E2E] hover:bg-violet-500/20 hover:text-violet-400 text-[#94A3B8] transition-all border border-[#2D2D3D] hover:border-violet-500/30"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-400" />
                <span className="text-green-400">복사됨</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                복사
              </>
            )}
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-[#1E1E2E] mb-4" />

      {/* Result content */}
      <div className="flex-1 overflow-y-auto">
        <div className="result-text text-[#E2E8F0] leading-relaxed">
          {renderResultText(result.text)}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-[#1E1E2E] flex items-center justify-between text-xs text-[#64748B]">
        <span>
          <span className="text-blue-400 font-medium">파란색</span>
          {" "}텍스트는 한화 환산 금액입니다
        </span>
        <span>{result.text.length.toLocaleString()} chars</span>
      </div>
    </div>
  );
}
