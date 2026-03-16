"use client";

import { useState } from "react";
import { UrlInput } from "@/components/converter/UrlInput";
import { CategorySelector } from "@/components/converter/CategorySelector";
import { ResultDisplay } from "@/components/converter/ResultDisplay";
import { Zap, AlertCircle } from "lucide-react";

export type Category = "무역통상" | "디지털헬스케어" | "의료서비스";

export interface ConversionResult {
  text: string;
  category: Category;
  url: string;
}

export default function DashboardPage() {
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState<Category>("무역통상");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [error, setError] = useState("");

  const handleConvert = async () => {
    if (!url.trim()) {
      setError("URL을 입력해주세요.");
      return;
    }

    try {
      new URL(url);
    } catch {
      setError("유효한 URL 형식이 아닙니다.");
      return;
    }

    setIsLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, category }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "변환 중 오류가 발생했습니다.");
      } else {
        setResult({ text: data.result, category, url });
      }
    } catch {
      setError("서버와 통신 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Zap className="w-6 h-6 text-violet-400" />
          뉴스 보고서 변환기
        </h1>
        <p className="text-[#64748B] text-sm mt-1">
          뉴스 기사 URL을 입력하고 분야를 선택하면 전문 보고서 형식으로 변환됩니다.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Left Panel - Input */}
        <div className="space-y-4">
          <div className="bg-[#12121A] border border-[#1E1E2E] rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-[#94A3B8] uppercase tracking-wider mb-4">
              입력
            </h2>

            <div className="space-y-4">
              <UrlInput value={url} onChange={setUrl} disabled={isLoading} />

              <CategorySelector
                value={category}
                onChange={setCategory}
                disabled={isLoading}
              />

              {error && (
                <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg px-4 py-3 text-sm">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                onClick={handleConvert}
                disabled={isLoading || !url.trim()}
                className="w-full glow-button bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-semibold py-3 rounded-xl text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    AI가 보고서를 작성 중입니다...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    보고서 생성
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-[#12121A] border border-[#1E1E2E] rounded-2xl p-5">
            <h3 className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-3">
              출력 형식 안내
            </h3>
            <ul className="space-y-2 text-xs text-[#64748B]">
              <li className="flex items-start gap-2">
                <span className="text-violet-400 mt-0.5">­</span>
                <span>Soft hyphen(­) + 공백으로 시작하는 bullet point</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-violet-400 mt-0.5">△</span>
                <span>세부 항목 구분 기호 (△항목1 △항목2 형태)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">■</span>
                <span>한화 금액은 파란색으로 표시됩니다</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-violet-400 mt-0.5">*</span>
                <span>전문 용어는 *용어 형태로 각주 처리</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Panel - Result */}
        <ResultDisplay
          result={result}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
