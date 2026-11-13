import type { MetadataRoute } from "next";
import { SITE_URL } from "./lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", // Les CV contiennent téléphone et adresse : accessibles par lien, pas dans Google.
    disallow: ["/api/", "/cv/"] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
