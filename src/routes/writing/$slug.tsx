import { Suspense } from "react";
import { createFileRoute, notFound } from "@tanstack/react-router";

import { PostLayout } from "@/components/post/PostLayout";
import { getLazyPost, getPostMeta } from "@/content/posts";
import { useDocumentTitle } from "@/lib/use-document-title";

function Post() {
  const { slug } = Route.useParams();
  const meta = getPostMeta(slug);
  const MDXContent = getLazyPost(slug);
  useDocumentTitle(meta?.title);
  if (!meta || !MDXContent) throw notFound();

  return (
    <PostLayout meta={meta}>
      <Suspense fallback={null}>
        <MDXContent />
      </Suspense>
    </PostLayout>
  );
}

export const Route = createFileRoute("/writing/$slug")({
  component: Post,
});
