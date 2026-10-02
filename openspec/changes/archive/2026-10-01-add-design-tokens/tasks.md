## 1. Token definition

- [x] 1.1 Add the Nunito Sans Google Fonts `<link>` (weights 300, 400, 600, 700, `display=swap`, with preconnect) to `apps/frontend/index.html`
- [x] 1.2 Replace the `@theme` block in `apps/frontend/src/tokens.css` with grouped sections: color roles (with `on-*` foregrounds, `card`, `text-muted`, `border`, `border-strong`), font family with system fallback, named type scale (size, weight, line height), spacing `xs` to `xl`, and radius (`base`, `sm`, `pill`)
- [x] 1.3 Update the `body` rule to use `surface` and `text` tokens and the body type style; remove the hardcoded lime gradient
- [x] 1.4 Run a frontend build (`pnpm --filter frontend build`) and confirm that the new utilities (`bg-primary`, `text-heading`, `p-m`, `rounded-pill`) are generated

## 2. Contrast verification

- [x] 2.1 Measure every text foreground/background token pair and confirm each is at least 4.5:1, and `border-strong` against `card` and `surface` is at least 3:1; record the measured values in the PR or commit notes

## 3. Component migration

- [x] 3.1 Migrate `apps/frontend/src/components/ui.tsx` (Mark, Screen, LoadingScreen, FormCard, Field, ErrorAlert, SuccessNotice, PrimaryButton, linkClass) to tokens following the mapping in design.md, including focus outline and error colors
- [x] 3.2 Migrate `LandingPage.tsx` (hero, tagline, access buttons) to tokens
- [x] 3.3 Migrate `LoginPage.tsx`, `RegisterPage.tsx`, and `RecoverPage.tsx` to tokens
- [x] 3.4 Migrate `MyPlansPage.tsx` to tokens

## 4. Verification

- [x] 4.1 Search `apps/frontend/src` for legacy names (`ink`, `muted` as a bare token, `paper`, `line`, `accent`, `font-sans`) and for raw colors (hex, rgb, default palette names like `red-`, `bg-white`); confirm none remain outside `tokens.css`
- [x] 4.2 Run the frontend type check, lint, and existing tests with `pnpm`; all must pass
- [ ] 4.3 Run the app with `pnpm dev` and visually check landing, login, register, recover (all three steps), and my plans at 375px and desktop width; confirm that routes, validation messages, and Spanish copy are unchanged
