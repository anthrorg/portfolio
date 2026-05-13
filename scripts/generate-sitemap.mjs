import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

import { getAllRoutes } from "./routes-manifest.mjs";

const SITE_URL = "https://author.sylphie.live";
const here = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(here, "..", "dist", "sitemap.xml");

function priorityFor(route) {
  if (route === "/") return "1.0";
  if (route === "/frontier" || route.startsWith("/frontier/")) return "0.8";
  return "0.6";
}

async function generate() {
  const routes = await getAllRoutes();
  const today = new Date().toISOString().split("T")[0];

  const urls = routes
    .map((route) => {
      const loc = `${SITE_URL}${route}`;
      return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>${priorityFor(route)}</priority>\n  </url>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

  await writeFile(OUT, xml, "utf8");
  console.log(`sitemap written → dist/sitemap.xml (${routes.length} urls)`);
}

generate().catch((err) => {
  console.error(err);
  process.exit(1);
});
