import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { scrapeArticle } from "@/lib/scraper";
import { convertArticle } from "@/lib/claude";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
    }

    const { url, category } = await req.json();

    if (!url || !category) {
      return NextResponse.json(
        { error: "URL과 카테고리는 필수입니다." },
        { status: 400 }
      );
    }

    // Validate URL
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      return NextResponse.json(
        { error: "유효하지 않은 URL 형식입니다." },
        { status: 400 }
      );
    }

    // Scrape article
    const article = await scrapeArticle(parsedUrl.toString());
    if (!article.content || article.content.length < 100) {
      return NextResponse.json(
        { error: "기사 내용을 가져오는 데 실패했습니다. URL을 확인해주세요." },
        { status: 422 }
      );
    }

    // Convert with Claude
    const result = await convertArticle({
      title: article.title,
      content: article.content,
      source: article.source,
      publishedDate: article.publishedDate,
      category,
    });

    // Save to database
    await prisma.conversion.create({
      data: {
        userId: session.user.id,
        url,
        category,
        result,
      },
    });

    return NextResponse.json({ result });
  } catch (error) {
    console.error("[convert]", error);
    const message = error instanceof Error ? error.message : "알 수 없는 오류";
    return NextResponse.json(
      { error: `변환 중 오류가 발생했습니다: ${message}` },
      { status: 500 }
    );
  }
}
