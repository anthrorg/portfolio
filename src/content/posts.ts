import {
  lazy,
  type ComponentType,
  type LazyExoticComponent,
} from "react";

import type { PostMeta } from "@/components/post/PostLayout";

const metaModules = import.meta.glob<PostMeta>(
  "/src/content/writing/*.mdx",
  { eager: true, import: "meta" },
);

const componentModules = import.meta.glob<{ default: ComponentType }>(
  "/src/content/writing/*.mdx",
);

export type PostEntry = {
  slug: string;
  meta: PostMeta;
};

export const posts: readonly PostEntry[] = Object.entries(metaModules)
  .map<PostEntry>(([path, meta]) => ({
    slug: slugFromPath(path),
    meta,
  }))
  .sort((a, b) => (a.meta.date < b.meta.date ? 1 : -1));

const lazyCache = new Map<string, LazyExoticComponent<ComponentType>>();

export function getLazyPost(
  slug: string,
): LazyExoticComponent<ComponentType> | null {
  const path = `/src/content/writing/${slug}.mdx`;
  const loader = componentModules[path];
  if (!loader) return null;
  let cached = lazyCache.get(path);
  if (!cached) {
    cached = lazy(loader);
    lazyCache.set(path, cached);
  }
  return cached;
}

export function getPostMeta(slug: string): PostMeta | undefined {
  return posts.find((p) => p.slug === slug)?.meta;
}

function slugFromPath(path: string): string {
  const file = path.split("/").pop() ?? "";
  return file.replace(/\.mdx$/, "");
}
