import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { HistoryList } from "@/components/history/HistoryList";
import { History } from "lucide-react";

export default async function HistoryPage() {
  const session = await getServerSession(authOptions);

  const conversions = await prisma.conversion.findMany({
    where: { userId: session!.user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const serialized = conversions.map((c) => ({
    id: c.id,
    url: c.url,
    category: c.category,
    result: c.result,
    createdAt: c.createdAt.toISOString(),
  }));

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <History className="w-6 h-6 text-violet-400" />
          변환 기록
        </h1>
        <p className="text-[#64748B] text-sm mt-1">
          최근 50개의 변환 기록을 확인할 수 있습니다.
        </p>
      </div>

      <HistoryList conversions={serialized} />
    </div>
  );
}
