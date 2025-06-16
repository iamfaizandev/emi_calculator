import { NextResponse } from "next/server";

export async function GET() {
  const robots = `
    User-agent: *
    Allow: /
    Disallow: /private/
    Disallow: /admin/
    Sitemap: https://emimitra.online/sitemap.xml
  `;
  return new NextResponse(robots, {
    headers: { "Content-Type": "text/plain" },
  });
}
