import type { MetadataRoute } from "next";
import { PAGES, SITE_URL } from "./lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["/", ...Object.keys(PAGES)];
  return paths.map((path) => ({
    url: `${SITE_URL}${path === "/" ? "" : path}`,
    changeFrequency: "monthly",
    priority: path === "/" || path === "/portfolio" ? 1 : 0.8,
  }));
}
