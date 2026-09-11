import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <span className="font-semibold tracking-tight">
          <span className="text-brand">ulo</span>
        </span>
      ),
    },
    githubUrl: "https://github.com/ulo-rs/ulo",
  };
}
