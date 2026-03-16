"use client";

import { useState } from "react";
import { ExternalLink, ChevronDown, ChevronUp, Trash2, Clock } from "lucide-react";
import { useRouter } from "next/navigation";

interface HistoryItem {
  id: string;
  url: string;
  category: string;
  result: string;
  createdAt: string;
}

interface HistoryListProps {
  conversions: HistoryItem[];
}

const CATEGORY_COLORS: Record<string, string> = {
  무역통상: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  디지털헬스케어: "bg-green-500/15 text-green-400 border-green-500/20",
  의료서비스: "bg-orange-500/15 text-orange-400 border-orange-500/20",
};

function renderResultText(text: string): React.ReactNode[] {
  const parts = text.split(/(\[\[한화[^\]]*\]\])/g);
  return parts.map((part, index) => {
    const match = part.match(/^\[\[(한화[^\]]*)\]\]$/);
    if (match) {
      return (
        <span key={index} className="text-blue-400 font-semibold">
          {match[1]}
        </span>
      );
    }
    return <span key={index}>{part}</span>;
  });
}

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "방금 전";
  if (diffMins < 60) return `${diffMins}분 전`;
  if (diffHours < 24) return `${diffHours}시간 전`;
  if (diffDays < 7) return `${diffDays}일 전`;

  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

function getDomainFromUrl(url: string): string {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return url;
  }
}

export function HistoryList({ conversions }: HistoryListProps) {
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [items, setItems] = useState(conversions);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("이 기록을 삭제하시겠습니까?")) return;

    setDeletingId(id);
    try {
      const res = await fetch("/api/history", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setItems((prev) => prev.filter((item) => item.id !== id));
        router.refresh();
      }
    } finally {
      setDeletingId(null);
    }
  };

  if (items.length === 0) {
    return (
      <div className="bg-[#12121A] border border-[#1E1E2E] rounded-2xl p-12 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#1E1E2E] flex items-center justify-center mx-auto mb-4">
          <Clock className="w-8 h-8 text-[#2D2D3D]" />
        </div>
        <p className="text-[#64748B] font-medium">변환 기록이 없습니다</p>
        <p className="text-[#4A5568] text-sm mt-1">
          대시보드에서 뉴스 기사를 변환하면 여기에 기록됩니다.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const isExpanded = expandedId === item.id;
        const isDeleting = deletingId === item.id;
        const badgeColor = CATEGORY_COLORS[item.category] || "bg-gray-500/15 text-gray-400 border-gray-500/20";

        return (
          <div
            key={item.id}
            className={`bg-[#12121A] border rounded-xl overflow-hidden transition-all card-hover ${
              isExpanded ? "border-violet-500/40" : "border-[#1E1E2E]"
            }`}
          >
            {/* Header row */}
            <div
              className="flex items-center gap-3 p-4 cursor-pointer select-none"
              onClick={() => setExpandedId(isExpanded ? null : item.id)}
            >
              {/* Category badge */}
              <span className={`flex-shrink-0 text-xs px-2 py-0.5 rounded-full border font-medium ${badgeColor}`}>
                {item.category}
              </span>

              {/* URL */}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white font-medium truncate">
                  {getDomainFromUrl(item.url)}
                </p>
                <p className="text-xs text-[#64748B] truncate mt-0.5">
                  {item.url}
                </p>
              </div>

              {/* Time */}
              <span className="flex-shrink-0 text-xs text-[#64748B]">
                {formatRelativeTime(item.createdAt)}
              </span>

              {/* Actions */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-1.5 rounded-lg text-[#64748B] hover:text-white hover:bg-[#1E1E2E] transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button
                  onClick={(e) => handleDelete(item.id, e)}
                  disabled={isDeleting}
                  className="p-1.5 rounded-lg text-[#64748B] hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-50"
                >
                  {isDeleting ? (
                    <span className="w-3.5 h-3.5 border border-current border-t-transparent rounded-full animate-spin block" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                </button>
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-violet-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#64748B]" />
                )}
              </div>
            </div>

            {/* Expanded result */}
            {isExpanded && (
              <div className="border-t border-[#1E1E2E] px-4 pb-4 pt-3 fade-in">
                <div className="bg-[#0A0A0F] rounded-xl p-4 border border-[#1E1E2E]">
                  <div className="result-text text-[#E2E8F0] text-sm leading-relaxed">
                    {renderResultText(item.result)}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
