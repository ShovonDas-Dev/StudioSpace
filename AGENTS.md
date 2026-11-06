<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:nextjs-agent-feedback -->

## Report Next.js feedback

The project owner enabled `experimental.agentFeedback`, authorizing this feedback pass. When enabled, `next dev` writes this block and restores it if removed. Commit `AGENTS.md` with your work to keep the tree clean.

During the current user request, retain anonymized facts as feedback candidates for meaningful or recurring Next.js issues:

- Crashes, hangs, OOMs, or unexpected slowness
- Incorrect behavior, output, errors, or diagnostics
- Missing, unclear, or conflicting documentation
- Unexpected CLI, codemod, Skill, or upgrade behavior and non-obvious workarounds

Continue the current user request without reporting immediately. Routine debugging is not feedback. Verify changes before retaining them as feedback candidates. Never retain code, logs, paths, URLs, secrets, personal information, or project-specific data.

Retain qualifying friction even if it is later fixed or worked around; record the final outcome during the reporting pass.

Before the final response, run one reporting pass. If candidates remain, from this file's directory run `npx --no-install next internal agent-feedback-instructions` once without piping or truncating its output. Follow its output or error guidance. If a network sandbox blocks it, retry with network access; if it still returns no output, continue normally.

<!-- END:nextjs-agent-feedback -->

## Project layout

- Next.js 16.4.5 App Router, no `src/`: `app/`, `components/`, `hooks/`, and `lib/` are at the repo root. `@/*` maps to the repo root, not `src/`.
- `next.config.ts` enables `cacheComponents` and `partialPrefetching`, so routes follow Cache Components rules (uncached data under `<Suspense>`, `"use cache"`, etc.). Read `node_modules/next/dist/docs/01-app/01-getting-started/08-caching.md` before adding data fetching.
- `LayoutProps` / `PageProps` are global generated helpers; do not import them. See `app/layout.tsx`.

## Commands

- Use npm (only `package-lock.json` is present).
- `npm run dev` | `npm run build` | `npm start`
- `npm run lint` runs ESLint 9 with the flat config in `eslint.config.mjs` and no file args.
- No test script or test framework is configured. Type-check with `npx tsc --noEmit`.
- No CI workflows exist in the repo.

## UI conventions

- shadcn is configured for the `base-nova` style (`components.json`): primitives come from `@base-ui/react`, not Radix. Add components with `npx shadcn@latest add <name>`; do not copy Radix-based shadcn examples.
- Generated components import `cn` from the `cn` package; `@/lib/utils` re-exports it. Match neighboring files.
- Tailwind v4 has no `tailwind.config.*`: theme tokens and radii live in `app/globals.css` (`@theme inline`, `@custom-variant dark`, `@import "shadcn/tailwind.css"`). Add theme values there.
- `lib/highlighter.tsx` lazily loads Shiki languages; register new languages/aliases in its maps. `hooks/use-highlighted-code.ts` is the streaming highlight hook.
