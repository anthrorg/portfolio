import { readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const CASE_DIR = resolve(here, "..", "src", "content", "work");

export const STATIC_ROUTES = ["/", "/about", "/career", "/contact", "/frontier"];

export async function getCaseSlugs() {
  const entries = await readdir(CASE_DIR);
  return entries
    .filter((name) => name.endsWith(".mdx"))
    .map((name) => name.replace(/\.mdx$/, ""));
}

export async function getAllRoutes() {
  const slugs = await getCaseSlugs();
  return [...STATIC_ROUTES, ...slugs.map((slug) => `/frontier/${slug}`)];
}
