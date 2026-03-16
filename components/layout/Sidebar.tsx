"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Zap, LayoutDashboard, History, Settings } from "lucide-react";

const navItems = [
  {
    href: "/dashboard",
    icon: <LayoutDashboard className="w-4 h-4" />,
    label: "대시보드",
  },
  {
    href: "/history",
    icon: <History className="w-4 h-4" />,
    label: "변환 기록",
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 flex-shrink-0 bg-[#0D0D14] border-r border-[#1E1E2E] flex flex-col">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-[#1E1E2E]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center flex-shrink-0">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-none">NewsConverter</p>
            <p className="text-[10px] text-[#64748B] mt-0.5">뉴스 보고서 변환기</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-item ${isActive ? "active" : ""}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-2 py-3 border-t border-[#1E1E2E]">
        <div className="px-3 py-2">
          <p className="text-[10px] text-[#2D2D3D] font-mono">v0.1.0</p>
        </div>
      </div>
    </aside>
  );
}
