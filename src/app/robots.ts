// app/robots.ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const site = "https://nicheclub.us";
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/"],
        disallow: [
          "/api/",
          "/studio/",
          "/sign-in",
          "/sign-up",
          "/unauthorized",
          "/_not-found",
          "/payment-success",
        ],
      },
    ],
    sitemap: `${site}/sitemap.xml`,
    host: "nicheclub.us",
  };
}
