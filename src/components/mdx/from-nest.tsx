import type { ReactNode } from "react";

/**
 * A collapsed aside carrying one NestJS-to-Ulo translation.
 *
 * Built on `<details>` rather than the fumadocs Accordion on purpose: Radix
 * unmounts closed content, which would keep these blocks out of the prerendered
 * HTML and out of search results. `<details>` keeps them in the DOM, closed.
 *
 * Reach for it only where a NestJS habit produces wrong Ulo code and the
 * correction is local to the page. The full decorator-to-macro map lives on
 * /docs/coming-from-nestjs and is not repeated here.
 */
export function FromNest({ children }: { children: ReactNode }) {
  return (
    <details className="group my-4 rounded-xl border bg-fd-card text-sm text-fd-card-foreground shadow-md">
      <summary className="flex cursor-pointer list-none items-center gap-2 rounded-xl p-3 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-ring [&::-webkit-details-marker]:hidden">
        <svg
          className="size-4 shrink-0 text-fd-muted-foreground transition-transform group-open:rotate-90"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
        Coming from NestJS
      </summary>
      <div className="prose-no-margin flex flex-col gap-3 border-t px-3 py-3 text-fd-muted-foreground">
        {children}
      </div>
    </details>
  );
}
