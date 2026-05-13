import { createServer } from "node:http";
import { createReadStream, statSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, extname, join, normalize, resolve } from "node:path";
import { chromium } from "@playwright/test";

import { getAllRoutes } from "./routes-manifest.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const DIST_DIR = resolve(here, "..", "dist");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript",
  ".mjs": "application/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".json": "application/json",
  ".pdf": "application/pdf",
  ".xml": "application/xml",
  ".txt": "text/plain",
  ".ico": "image/x-icon",
};

function safeJoin(root, requested) {
  const safe = normalize(requested).replace(/^([./\\]+)+/, "");
  return join(root, safe);
}

function resolveFilePath(rootDir, urlPath) {
  let filePath = safeJoin(rootDir, urlPath);
  try {
    const s = statSync(filePath);
    if (s.isDirectory()) filePath = join(filePath, "index.html");
  } catch {
    return join(rootDir, "index.html");
  }
  try {
    statSync(filePath);
    return filePath;
  } catch {
    return join(rootDir, "index.html");
  }
}

function startServer(rootDir) {
  return new Promise((resolveServer, rejectServer) => {
    const server = createServer((req, res) => {
      try {
        const url = new URL(req.url ?? "/", "http://localhost");
        const filePath = resolveFilePath(rootDir, decodeURIComponent(url.pathname));
        const ext = extname(filePath).toLowerCase();
        res.setHeader("Content-Type", MIME[ext] ?? "application/octet-stream");
        createReadStream(filePath).pipe(res);
      } catch (err) {
        res.statusCode = 500;
        res.end(String(err));
      }
    });
    server.once("error", rejectServer);
    server.listen(0, "127.0.0.1", () => {
      const addr = server.address();
      const port = typeof addr === "object" && addr ? addr.port : 0;
      resolveServer({ server, port });
    });
  });
}

function outputPathFor(route) {
  if (route === "/") return join(DIST_DIR, "index.html");
  const segments = route.split("/").filter(Boolean);
  return join(DIST_DIR, ...segments, "index.html");
}

async function prerender() {
  const routes = await getAllRoutes();
  const paths = routes.map((r) => r.path);
  console.log(`prerendering ${routes.length} routes:`, paths.join(", "));

  const { server, port } = await startServer(DIST_DIR);
  const browser = await chromium.launch({ chromiumSandbox: false });
  const context = await browser.newContext({
    locale: "en-US",
    viewport: { width: 1280, height: 800 },
    reducedMotion: "reduce",
  });
  await context.addInitScript(() => {
    window.__PRERENDER__ = true;
    try {
      localStorage.setItem("lang", "en");
    } catch {}
  });

  const errors = [];
  try {
    for (const { path: route } of routes) {
      const page = await context.newPage();
      try {
        const url = `http://127.0.0.1:${port}${route}`;
        await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
        await page.waitForSelector('link[rel="canonical"]', {
          state: "attached",
          timeout: 15000,
        });
        await page.waitForLoadState("networkidle", { timeout: 15000 });
        const html = await page.content();
        const outPath = outputPathFor(route);
        await mkdir(dirname(outPath), { recursive: true });
        await writeFile(outPath, html, "utf8");
        console.log(`  ✓ ${route} → ${outPath.replace(DIST_DIR, "dist")}`);
      } catch (err) {
        errors.push({ route, err });
        console.error(`  ✗ ${route}: ${err.message}`);
      } finally {
        await page.close();
      }
    }
  } finally {
    await context.close();
    await browser.close();
    server.close();
  }

  if (errors.length > 0) {
    console.error(`\nprerender failed for ${errors.length} route(s)`);
    process.exit(1);
  }
  console.log(`\nprerender complete (${routes.length} routes)`);
}

prerender().catch((err) => {
  console.error(err);
  process.exit(1);
});
