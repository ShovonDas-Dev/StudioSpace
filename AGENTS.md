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
- Mixed JS/TS: `app/page.jsx`, `components/Hero/hero-section.jsx`, and the `components/Home/*` sections are plain JSX; most other files are TSX. `allowJs` is on, so match the file you are editing rather than converting it.
- `app/layout.tsx` wraps every page with `Navbar`, `Footer`, `ThemeProvider`, and `Toaster`, and injects `THEME_SCRIPT` (from `lib/theme.ts`) inline in `<head>`. New routes get the chrome automatically.
- `LayoutProps` / `PageProps` are global generated helpers; do not import them. See `app/studios/[id]/page.tsx` for `PageProps<"/studios/[id]">` usage.

## Data, auth, and routes

- Studio listings and bookings come from a separate backend at `http://localhost:5000` (not in this repo): `API_URL` in `lib/studios.ts` (`/allStudio`), booking POST/GET on `/booking`. With the API down, `/studios` shows its error state and booking requests fail. Normalize raw API objects with `normalizeStudio` / `normalizeStudioDetails` from `lib/studios.ts`.
- Auth is better-auth (email/password + Google OAuth) with MongoDB via `@better-auth/mongo-adapter`: server config in `lib/auth.ts`, client hook `authClient` in `lib/auth-client.ts` (`authClient.useSession()`), catch-all handler at `app/api/auth/[...all]/route.ts`.
- `.env` holds `MONGODB_URI`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `BETTER_AUTH_URL`. Gotchas: `lib/auth.ts` hardcodes `baseURL`/`trustedOrigins` to `http://localhost:3000` (ignoring `BETTER_AUTH_URL`), and `lib/auth-client.ts` reads `BASE_URI`, which is not in `.env`.
- Routes present: `/`, `/studios`, `/studios/[id]`, `/add-studio`, `/my-listings`, `/login` + `/register` under `app/(Authentication)/`, and `/api/auth/[...all]`. Navbar still links to `/my-bookings`, which has no page.
- `next.config.ts` enables `cacheComponents` and `partialPrefetching` at the top level, so routes follow Cache Components rules (uncached data under `<Suspense>`, `"use cache"`, etc.). Read `node_modules/next/dist/docs/01-app/01-getting-started/08-caching.md` before adding data fetching.

## Commands

- Use npm (only `package-lock.json` is present).
- `npm run dev` | `npm run build` | `npm start`
- `npm run lint` runs ESLint 9 with the flat config in `eslint.config.mjs` and no file args. It exits non-zero on baseline with two pre-existing `react-hooks/set-state-in-effect` errors: `components/ui/carousel.tsx:98` and `hooks/use-mobile.ts:14`, plus ~10 unused-var / `no-img-element` warnings. Do not attribute these to your change.
- Type-check with `npx tsc --noEmit`. In the current working tree it fails on `components/StudioDetails/booking-card.tsx` importing the deleted `@/lib/bookings` — pre-existing, not your change.
- No test script or test framework is configured. No CI workflows exist in the repo.

## UI conventions

- shadcn is configured for the `base-nova` style (`components.json`): primitives come from `@base-ui/react`, not Radix. Add components with `npx shadcn@latest add <name>`; do not copy Radix-based shadcn examples.
- Base UI composition uses a `render` prop instead of Radix `asChild`, e.g. `<Button render={<Link href="/studios" />} nativeButton={false}>` in `components/Hero/hero-section.jsx`.
- Import `cn` from the `cn` package, as the app components do; `@/lib/utils` re-exports it.
- Tailwind v4 has no `tailwind.config.*`: theme tokens, radii, shadows, and animations live in `app/globals.css` (`@theme inline`, `@custom-variant dark`, `@import "shadcn/tailwind.css"`). Add theme values there.
- Reuse the global classes in `app/globals.css`: `container-page`, `eyebrow`, `on-image`, `hero-scrim`. Headings use `font-display` (Fraunces) and body uses `font-sans` (Manrope), wired in `app/layout.tsx`.
- Theme is custom (`lib/theme.ts` + `components/Navbar/theme-provider.tsx`, localStorage key `studiospace:theme`), not `next-themes`, even though `next-themes` is installed.
- `next/image` uses `preload`; `priority` is deprecated in Next 16. See `components/Hero/hero-section.jsx`.
- `lib/highlighter.tsx` lazily loads Shiki languages; register new languages/aliases in its maps. `hooks/use-highlighted-code.ts` is the streaming highlight hook.
