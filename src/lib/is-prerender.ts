declare global {
  interface Window {
    __PRERENDER__?: boolean;
  }
}

export function isPrerender(): boolean {
  return typeof window !== "undefined" && window.__PRERENDER__ === true;
}
