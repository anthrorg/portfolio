import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { chromium } from "@playwright/test";

const here = dirname(fileURLToPath(import.meta.url));
const SOURCE = resolve(here, "..", "public", "og-source.html");
const OUTPUT = resolve(here, "..", "public", "og-default.png");

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 1,
});
const page = await context.newPage();
await page.goto(`file://${SOURCE}`);
await page.evaluate(() => document.fonts.ready);
const card = page.locator(".card");
await card.screenshot({ path: OUTPUT, type: "png" });
await browser.close();
console.log(`Wrote ${OUTPUT}`);
