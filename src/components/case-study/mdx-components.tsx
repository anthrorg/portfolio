import { type AnchorHTMLAttributes, type HTMLAttributes } from "react";
import type { MDXComponents } from "mdx/types";

import { cn } from "@/lib/cn";

function H2({ className, ...rest }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn(
        "mt-20 scroll-mt-24 font-display text-3xl tracking-tight md:text-4xl",
        className,
      )}
      {...rest}
    />
  );
}

function H3({ className, ...rest }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "mt-12 scroll-mt-24 font-display text-2xl tracking-tight md:text-3xl",
        className,
      )}
      {...rest}
    />
  );
}

function P({ className, ...rest }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        "mt-6 max-w-prose text-base leading-relaxed text-ink md:text-lg",
        className,
      )}
      {...rest}
    />
  );
}

function UL({ className, ...rest }: HTMLAttributes<HTMLUListElement>) {
  return (
    <ul
      className={cn(
        "mt-6 max-w-prose list-disc space-y-2 pl-6 text-ink",
        className,
      )}
      {...rest}
    />
  );
}

function OL({ className, ...rest }: HTMLAttributes<HTMLOListElement>) {
  return (
    <ol
      className={cn(
        "mt-6 max-w-prose list-decimal space-y-2 pl-6 text-ink",
        className,
      )}
      {...rest}
    />
  );
}

function Blockquote({ className, ...rest }: HTMLAttributes<HTMLQuoteElement>) {
  return (
    <blockquote
      className={cn(
        "mt-8 max-w-prose border-l-2 border-accent pl-6 italic text-ink-muted",
        className,
      )}
      {...rest}
    />
  );
}

function A({ className, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const isHeadingAnchor =
    typeof className === "string" && className.includes("heading-anchor");
  return (
    <a
      className={cn(
        isHeadingAnchor
          ? "no-underline"
          : "underline decoration-border decoration-1 underline-offset-4 transition-colors hover:text-accent hover:decoration-accent",
        className,
      )}
      {...rest}
    />
  );
}

function InlineCode({ className, ...rest }: HTMLAttributes<HTMLElement>) {
  return (
    <code
      className={cn(
        "rounded-md bg-surface px-1.5 py-0.5 font-mono text-[0.85em]",
        className,
      )}
      {...rest}
    />
  );
}

function Pre({ className, ...rest }: HTMLAttributes<HTMLPreElement>) {
  return (
    <pre
      className={cn(
        "mt-6 overflow-x-auto rounded-2xl border border-border bg-surface p-5 font-mono text-sm leading-relaxed",
        className,
      )}
      {...rest}
    />
  );
}

function HR({ className, ...rest }: HTMLAttributes<HTMLHRElement>) {
  return <hr className={cn("my-16 border-border", className)} {...rest} />;
}

export const mdxComponents: MDXComponents = {
  h2: H2,
  h3: H3,
  p: P,
  ul: UL,
  ol: OL,
  blockquote: Blockquote,
  a: A,
  code: InlineCode,
  pre: Pre,
  hr: HR,
};
