import { useEffect } from "react";

const SITE = "Jim Tisdale";

export function useDocumentTitle(pageTitle?: string) {
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.title = pageTitle ? `${pageTitle} — ${SITE}` : SITE;
  }, [pageTitle]);
}
