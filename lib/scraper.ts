import * as cheerio from "cheerio";

export interface ArticleData {
  title: string;
  content: string;
  source: string;
  publishedDate: string;
}

export async function scrapeArticle(url: string): Promise<ArticleData> {
  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
    },
    signal: AbortSignal.timeout(15000),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: 페이지를 가져올 수 없습니다.`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  // Remove noise elements
  $("script, style, nav, footer, header, aside, .ad, .advertisement, .sidebar, .menu, .navigation, .comments, .social-share, iframe, noscript").remove();

  // Extract title
  const title =
    $('meta[property="og:title"]').attr("content") ||
    $('meta[name="twitter:title"]').attr("content") ||
    $("h1").first().text().trim() ||
    $("title").text().trim() ||
    "";

  // Extract published date
  const publishedDate =
    $('meta[property="article:published_time"]').attr("content") ||
    $('meta[name="pubdate"]').attr("content") ||
    $('meta[name="publishdate"]').attr("content") ||
    $('meta[property="og:updated_time"]').attr("content") ||
    $("time[datetime]").first().attr("datetime") ||
    $("time").first().text().trim() ||
    new Date().toISOString().split("T")[0];

  // Format the date
  const formattedDate = formatDate(publishedDate);

  // Extract source/publisher
  const source =
    $('meta[property="og:site_name"]').attr("content") ||
    $('meta[name="author"]').attr("content") ||
    extractDomainName(url) ||
    "Unknown";

  // Extract content - try multiple selectors for various news sites
  let content = "";

  const contentSelectors = [
    "article",
    '[role="main"]',
    ".article-body",
    ".article-content",
    ".news-content",
    ".post-content",
    ".entry-content",
    ".story-body",
    ".article__body",
    ".articleBody",
    "#article-body",
    "#articleBody",
    ".cont_area",
    "#newsct_article",
    ".news_article",
    ".view_cont",
    ".article_view",
    "main",
  ];

  for (const selector of contentSelectors) {
    const el = $(selector);
    if (el.length > 0) {
      const text = el.text().trim();
      if (text.length > 200) {
        content = text;
        break;
      }
    }
  }

  // Fallback to body if no content found
  if (!content || content.length < 100) {
    content = $("body").text().trim();
  }

  // Clean up content
  content = content
    .replace(/\s+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .substring(0, 8000); // Limit to 8000 chars for Claude

  return {
    title: title.substring(0, 500),
    content,
    source,
    publishedDate: formattedDate,
  };
}

function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      // Try to parse Korean date formats
      const koreanMatch = dateStr.match(/(\d{4})[.\-\/](\d{1,2})[.\-\/](\d{1,2})/);
      if (koreanMatch) {
        const [, year, month, day] = koreanMatch;
        return `${year}.${month.padStart(2, "0")}.${day.padStart(2, "0")}.`;
      }
      return new Date().toISOString().split("T")[0].replace(/-/g, ".") + ".";
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}.${month}.${day}.`;
  } catch {
    return new Date().toISOString().split("T")[0].replace(/-/g, ".") + ".";
  }
}

function extractDomainName(url: string): string {
  try {
    const hostname = new URL(url).hostname;
    const parts = hostname.replace("www.", "").split(".");
    return parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
  } catch {
    return "Unknown";
  }
}
