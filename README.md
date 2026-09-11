# Ulo documentation

The documentation site for [ulo-rs](https://github.com/ulo-rs/ulo), built with
[fumadocs](https://fumadocs.dev) on Next.js.

```bash
pnpm install
pnpm dev      # http://localhost:3000
```

## Layout

| Path | What lives there |
| --- | --- |
| `content/docs/` | Every page, as MDX. `meta.json` in a folder sets its title and page order. |
| `src/app/page.tsx` | The landing page at `/`. |
| `src/components/mdx/` | Components available to MDX, registered in `src/mdx-components.tsx`. |
| `src/lib/layout.shared.tsx` | Nav title and links shared by every layout. |

## Writing

Pages need `title` and `description` frontmatter; the description is the search
result and the meta tag, so write it as a sentence about the page.

`<FromNest>` renders a collapsed "Coming from NestJS" aside. Use it only where a
NestJS habit produces wrong Ulo code and the correction is local to the page —
the full decorator-to-macro map belongs on `/docs/coming-from-nestjs`, not
repeated inline.

## Deploying

Set `NEXT_PUBLIC_SITE_URL` to the deployed origin. Open Graph image URLs are
resolved against it, and links shared without it point at localhost.
