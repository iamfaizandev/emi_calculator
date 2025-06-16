import { NextResponse } from "next/server";

export async function GET() {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>https://emimitra.online/</loc>
        <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
      </url>
      <!-- Add more URLs dynamically if needed -->
    </urlset>`;
  return new NextResponse(sitemap, {
    headers: { "Content-Type": "application/xml" },
  });
}
