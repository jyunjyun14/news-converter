import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const [conversions, total] = await Promise.all([
      prisma.conversion.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.conversion.count({
        where: { userId: session.user.id },
      }),
    ]);

    return NextResponse.json({
      conversions,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("[history GET]", error);
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
    }

    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "ID가 필요합니다." }, { status: 400 });
    }

    // Verify ownership before deleting
    const conversion = await prisma.conversion.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!conversion) {
      return NextResponse.json({ error: "찾을 수 없습니다." }, { status: 404 });
    }

    await prisma.conversion.delete({ where: { id } });

    return NextResponse.json({ message: "삭제되었습니다." });
  } catch (error) {
    console.error("[history DELETE]", error);
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
