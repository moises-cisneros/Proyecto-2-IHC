## Why

The frontend styles live in five loose colors and one system font declared in `apps/frontend/src/tokens.css` (`ink`, `muted`, `paper`, `line`, `accent`, `font-sans`). Components also hardcode Tailwind palette values (`red-700`, `red-300`, `bg-white`) and ad-hoc sizes, so there is no single source of truth for the visual identity of Planazo. A centralized token system makes the UI consistent, lets us verify accessibility (contrast) in one place, and lets later screens (plans, polls) reuse the same vocabulary.

## What Changes

- Replace the loose theme variables in `tokens.css` with a structured token system, organized in the same groups as the class reference `EjemploTokens.md` (structure only, values are Planazo's own):
  - **Color roles**: primary, secondary, surface, second surface, success, warning, error, text, plus the `on-*` foreground for each role that carries text.
  - **Typography**: a single font family and a named scale (heading, subheading, body, body light, label, button, caption, caption small), each with size and weight.
  - **Spacing**: named scale `xs`, `s`, `m`, `l`, `xl`.
  - **Border radius**: one base value, with derived sizes.
- Define the Planazo palette with the `ui-ux-pro-max` guidance: semantic tokens (no raw hex in components), text/background pairs at 4.5:1 minimum, no body text below 12px.
- Load the chosen font family (Google Fonts, `display=swap`) from `index.html`.
- Migrate every component and page that uses the old tokens or hardcoded palette classes (`components/ui.tsx`, `LandingPage`, `LoginPage`, `RegisterPage`, `RecoverPage`, `MyPlansPage`) to the new tokens.
- **BREAKING** (internal only): remove the old `--color-ink`, `--color-muted`, `--color-paper`, `--color-line`, `--color-accent`, `--font-sans` variables and the Tailwind utilities derived from them (`text-ink`, `bg-ink`, `text-accent`, `text-muted`, `border-line`, `bg-paper`).
- No change in routes, API, copy, or behavior. UI text stays in Spanish.

## Capabilities

### New Capabilities

- `design-tokens`: the token system (color roles, typography scale, spacing scale, radius) defined in one place in the frontend, the accessibility constraints on those tokens, and the rule that components consume tokens instead of raw values.

### Modified Capabilities
<!-- None. Existing specs (access-routes, user-auth, dev-environment, test-user-seeding) describe behavior that does not change. -->

## Impact

- Code: `apps/frontend/src/tokens.css`, `apps/frontend/index.html`, `apps/frontend/src/components/ui.tsx`, and the pages under `apps/frontend/src/pages/`.
- Dependencies: none added (font loaded from Google Fonts via `<link>`; Tailwind v4 `@theme` already in use).
- Backend, Docker, Prisma, and seeders: untouched.
- Risk: visual regressions on the auth screens; mitigated by checking each screen manually and by the existing frontend tests, if any exist.
