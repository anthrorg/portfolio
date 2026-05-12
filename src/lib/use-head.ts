import { useEffect } from "react";

const SITE_NAME = "Jim Tisdale";
const SITE_URL = "https://author.sylphie.live";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.png`;

export type HeadConfig = {
  title?: string;
  description: string;
  path: string;
  ogImage?: string;
  ogType?: "website" | "article";
};

type MetaKind = "name" | "property";

function upsertMeta(kind: MetaKind, key: string, content: string) {
  const selector = `meta[${kind}="${key}"]`;
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(kind, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.rel = "canonical";
    document.head.appendChild(el);
  }
  el.href = href;
}

export function useHead(config: HeadConfig) {
  const { title, description, path, ogImage, ogType } = config;
  useEffect(() => {
    const fullTitle = title ? `${title} — ${SITE_NAME}` : SITE_NAME;
    const url = `${SITE_URL}${path}`;
    const image = ogImage ?? DEFAULT_OG_IMAGE;
    const type = ogType ?? "website";

    document.title = fullTitle;
    upsertMeta("name", "description", description);
    upsertCanonical(url);
    upsertMeta("property", "og:title", fullTitle);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:url", url);
    upsertMeta("property", "og:image", image);
    upsertMeta("property", "og:type", type);
    upsertMeta("name", "twitter:title", fullTitle);
    upsertMeta("name", "twitter:description", description);
    upsertMeta("name", "twitter:image", image);
  }, [title, description, path, ogImage, ogType]);
}
