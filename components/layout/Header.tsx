"use client";

import { signOut } from "next-auth/react";
import { useState } from "react";
import { LogOut, User, ChevronDown } from "lucide-react";

interface HeaderProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function Header({ user }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <header className="h-14 flex-shrink-0 bg-[#0D0D14] border-b border-[#1E1E2E] flex items-center justify-between px-6">
      {/* Left - breadcrumb could go here */}
      <div />

      {/* Right - user menu */}
      <div className="relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-[#1E1E2E] transition-colors"
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
            {user?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.image}
                alt={user.name || ""}
                className="w-7 h-7 rounded-full object-cover"
              />
            ) : (
              initials
            )}
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-medium text-white leading-none">
              {user?.name || "사용자"}
            </p>
            <p className="text-[10px] text-[#64748B] mt-0.5 truncate max-w-[120px]">
              {user?.email || ""}
            </p>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-[#64748B]" />
        </button>

        {/* Dropdown */}
        {menuOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setMenuOpen(false)}
            />
            <div className="absolute right-0 top-full mt-1 w-48 bg-[#12121A] border border-[#1E1E2E] rounded-xl shadow-2xl z-20 overflow-hidden">
              <div className="px-3 py-2 border-b border-[#1E1E2E]">
                <p className="text-xs font-medium text-white truncate">
                  {user?.name || "사용자"}
                </p>
                <p className="text-[10px] text-[#64748B] truncate">{user?.email}</p>
              </div>
              <div className="p-1">
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#94A3B8] hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  로그아웃
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
