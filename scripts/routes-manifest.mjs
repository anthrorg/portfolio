import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const ROUTE_TREE = resolve(here, "..", "src", "routeTree.gen.ts");
const CASE_DIR = resolve(here, "..", "src", "content", "work");

// Dynamic-param enumerators. Keyed by route ID as it appears in routeTree.gen.ts.
// Adding a new dynamic route forces a deliberate decision about where its
// values come from — there's no silent guess.
const DYNAMIC_PARAMS = {
  "/cutting-edge-tech/$slug": async () => {
    const entries = await readdir(CASE_DIR);
    return entries
      .filter((name) => name.endsWith(".mdx"))
      .map((name) => name.replace(/\.mdx$/, ""));
  },
};

// Pull route IDs out of routeTree.gen.ts. The plugin always emits each route as
// `.update({ id: '/path', ... })`, so the IDs are the canonical served paths.
async function readRouteIds() {
  const src = await readFile(ROUTE_TREE, "utf8");
  const ids = new Set();
  for (const match of src.matchAll(/\.update\(\{\s*id:\s*'([^']+)'/g)) {
    ids.add(match[1]);
  }
  if (ids.size === 0) {
    throw new Error(
      `no route IDs found in ${ROUTE_TREE} — has vite build run yet?`,
    );
  }
  return ids;
}

function normalizeIndexPath(id) {
  // Trailing-slash index routes ('/cutting-edge-tech/') serve at the bare
  // parent path ('/cutting-edge-tech'). Root '/' stays as-is.
  if (id !== "/" && id.endsWith("/")) return id.slice(0, -1);
  return id;
}

export async function getAllRoutes() {
  const ids = await readRouteIds();
  const staticRoutes = [];
  const dynamicTemplates = [];

  for (const id of ids) {
    if (id.includes("$")) {
      dynamicTemplates.push(id);
    } else {
      staticRoutes.push({ path: normalizeIndexPath(id), kind: "static" });
    }
  }

  const dynamic = [];
  for (const tpl of dynamicTemplates) {
    const enumerate = DYNAMIC_PARAMS[tpl];
    if (!enumerate) {
      throw new Error(
        `dynamic route ${tpl} has no enumerator in DYNAMIC_PARAMS — add one in scripts/routes-manifest.mjs`,
      );
    }
    const parent = tpl.replace(/\/\$[^/]+$/, "");
    const values = await enumerate();
    for (const v of values) {
      dynamic.push({ path: `${parent}/${v}`, kind: "dynamic", parent });
    }
  }

  staticRoutes.sort((a, b) => a.path.localeCompare(b.path));
  dynamic.sort((a, b) => a.path.localeCompare(b.path));
  return [...staticRoutes, ...dynamic];
}
