import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://www.emimitra.online/";
  return [{ url: `${baseUrl}/emi-calculator`, lastModified: new Date() }];
}
