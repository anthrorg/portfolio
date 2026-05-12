import type { AnyRouter } from "@tanstack/react-router";
import type { PostHog } from "posthog-js";

import { isPrerender } from "./is-prerender";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

const POSTHOG_KEY = import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN;
const POSTHOG_HOST =
  import.meta.env.VITE_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";
const GA_ID = import.meta.env.VITE_PUBLIC_GA_MEASUREMENT_ID;

function loadGtag(measurementId: string) {
  window.dataLayer = window.dataLayer ?? [];
  const gtag: NonNullable<Window["gtag"]> = function gtag(...args) {
    window.dataLayer!.push(args);
  };
  window.gtag = gtag;
  gtag("js", new Date());
  gtag("config", measurementId, { send_page_view: false });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);
}

export function initAnalytics(router: AnyRouter) {
  if (isPrerender() || typeof window === "undefined") return;
  if (!POSTHOG_KEY && !GA_ID) return;

  let posthog: PostHog | null = null;
  const posthogReady = POSTHOG_KEY
    ? import("posthog-js").then((mod) => {
        posthog = mod.default;
        posthog.init(POSTHOG_KEY, {
          api_host: POSTHOG_HOST,
          capture_pageview: false,
          capture_pageleave: true,
          autocapture: true,
          person_profiles: "identified_only",
        });
      })
    : Promise.resolve();

  if (GA_ID) loadGtag(GA_ID);

  router.subscribe("onResolved", ({ toLocation }) => {
    const path = toLocation.pathname + (toLocation.searchStr ?? "");
    const url = window.location.origin + path;

    if (POSTHOG_KEY) {
      void posthogReady.then(() => {
        posthog?.capture("$pageview", { $current_url: url });
      });
    }
    if (GA_ID && window.gtag) {
      window.gtag("event", "page_view", {
        page_path: path,
        page_location: url,
      });
    }
  });
}
