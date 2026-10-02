## Context

The frontend (`apps/frontend`) uses Tailwind CSS v4. Theme values live in a `@theme` block in `src/tokens.css`, which Tailwind turns into utilities (`text-ink`, `bg-accent`, `border-line`, ...). Five components/pages consume them (`components/ui.tsx`, `LandingPage`, `LoginPage`, `RegisterPage`, `RecoverPage`, `MyPlansPage`), and `ui.tsx` also uses default palette classes (`red-700`, `red-300`, `red-50`, `red-800`, `bg-white`) plus arbitrary sizes. See proposal.md - Why.

The class reference `EjemploTokens.md` provides the **structure** only (role names, named type scale, named spacing steps, base radius). Values below are Planazo's own.

## Goals / Non-Goals

**Goals:**

- One `@theme` block as the only token source, grouped like the reference.
- Components reference semantic utilities only; no raw colors.
- All text pairs verified at 4.5:1 or better.

**Non-Goals:**

- Dark mode (the palette leaves room for it, but it is not part of this change).
- New components, new screens, or layout changes.
- Self-hosting fonts or adding a font package.

## Decisions

### 1. Tokens live in Tailwind v4 `@theme`, grouped by section

Use `--color-*`, `--font-*`, `--text-*`, `--spacing-*` and `--radius-*` inside `@theme` so each token becomes a utility automatically (`bg-primary`, `text-heading`, `p-m`, `rounded-base`). Alternative: plain `:root` custom properties with manual utility mapping. Rejected: duplicates work and loses the generated utilities.

Spacing tokens use the namespaced keys `--spacing-xs ... --spacing-xl`, which generate `p-xs`, `gap-m`, etc. They are added next to Tailwind's default numeric scale, so they do not break any existing numeric utility during migration.

### 2. Palette (semantic roles, values chosen for Planazo)

Direction: friendly and collaborative, an indigo primary with a warm coral secondary on a soft off-white surface. The `ui-ux-pro-max` design-system query returned a wedding-style pink/gold palette with script fonts; it does not fit a group-planning tool, so only its rules were applied (semantic tokens, 4.5:1 contrast, 12px minimum) and the colors were chosen deliberately.

| Role token | Value | Used for |
| --- | --- | --- |
| `primary` / `on-primary` | `#4F46E5` / `#FFFFFF` | Main action, links |
| `secondary` / `on-secondary` | `#FF8A5B` / `#1F1B2E` | Badges, highlights |
| `surface` | `#F7F6FB` | Page background |
| `second-surface` / `on-second-surface` | `#1F1B3D` / `#F7F6FB` | Dark areas (brand mark, future sidebar) |
| `card` | `#FFFFFF` | Inputs and notices |
| `success` / `on-success` | `#15803D` / `#FFFFFF` | Confirmation |
| `warning` / `on-warning` | `#B45309` / `#FFFFFF` | Alerts |
| `error` / `on-error` | `#B91C1C` / `#FFFFFF` | Errors, destructive |
| `text` | `#1F1B2E` | Text on surface |
| `text-muted` | `#5B5670` | Secondary text |
| `border` | `#D9D6E5` | Decorative dividers |
| `border-strong` | `#8A8599` | Input boundaries |

Measured contrast: on-primary/primary 6.29, on-secondary/secondary 7.20, text/surface 15.57, text-muted/surface 6.49, on-second-surface/second-surface 15.23, on-success/success 5.02, on-warning/warning 5.02, on-error/error 6.47, error/surface 6.02, primary/surface 5.85, border-strong/white 3.56 (>= 3:1 for control boundaries). `border` is 1.33 and is therefore restricted to decorative dividers, never to a control boundary.

Tinted notice backgrounds (error and success notices) are derived with `color-mix()` from the role token instead of introducing new raw values.

### 3. One font family: Nunito Sans

Matches the reference's "one family" structure and the soft, approachable tone found in the skill's "Soft Rounded" pairing, without a second display font. Loaded from Google Fonts in `index.html` with `display=swap`, weights 300, 400, 600, 700. Fallback stack: `system-ui, sans-serif`. Alternative: keep Segoe UI (not available on macOS/Linux/Android, inconsistent rendering). Rejected.

### 4. Type scale as named `--text-*` tokens with weight and line height

| Token | Size | Weight |
| --- | --- | --- |
| heading | 28px (1.75rem) | 700 |
| subheading | 20px (1.25rem) | 600 |
| body | 16px | 400 |
| body-light | 16px | 300 |
| label | 14px | 600 |
| button | 16px | 600 |
| caption | 12px | 400 |
| caption-small | 12px | 300 |

Sizes are in `rem` so user font scaling is respected. Body is 16px (the reference's 12px is not used: the skill requires at least 16px body, and nothing goes under 12px). Weights are attached through the Tailwind v4 `--text-*--font-weight` and `--text-*--line-height` companion variables so `text-heading` applies size, weight, and line height together. The landing hero keeps its fluid `clamp()` display size; it is documented as a one-off display style and not part of the scale. Alternative: raise it to a `display` token. Deferred to avoid growing the scale beyond the structure.

### 5. Spacing and radius

Spacing: `xs` 4px, `s` 8px, `m` 16px, `l` 24px, `xl` 40px (4px grid, per the skill's spacing rule). Radius: `--radius-base` 12px, with `--radius-sm` 8px for inputs/notices and `--radius-pill` for buttons, both defined relative to the same section so rounding stays coherent. Existing pill buttons keep their shape through `rounded-pill`.

### 6. Migration mapping

| Old | New |
| --- | --- |
| `bg-ink text-accent` (buttons, Mark) | `bg-primary text-on-primary` (buttons), `bg-second-surface text-on-second-surface` (Mark) |
| `text-ink`, default text | `text-text` |
| `text-muted` | `text-text-muted` |
| `border-line` (dividers) | `border-border` |
| `border-line` (inputs) | `border-border-strong` |
| `bg-white` | `bg-card` |
| `text-red-700`, `border-red-300 bg-red-50 text-red-800` | `text-error`, error notice built from `error` |
| focus outline `outline-ink` | `outline-primary` |
| body gradient with hardcoded lime rgba | solid `surface` (gradient removed; it used a raw color) |

Success notice keeps its neutral look but gets `border-success` and a text prefix is not added (copy must not change).

### 7. Enforcement

A grep-based check in the verification step (hex/rgb/default palette names and legacy names must not appear outside `tokens.css`) backs the "components consume tokens only" requirement. No new lint tooling is added.

## Risks / Trade-offs

- [Visual regression on auth screens] -> Check each screen (landing, login, register, recover, my plans) at 375px and desktop after migration.
- [Tailwind v4 namespace behavior for `--text-*` companions and `--spacing-*`] -> Confirm utility generation with a build before migrating components; use Context7 docs for Tailwind v4 if a utility does not generate.
- [Google Fonts is an external request] -> `display=swap` plus the system fallback keep text readable if it fails; self-hosting is a later option.
- [Removing the lime gradient changes the first impression of the page] -> Accepted; the gradient used a raw color outside the palette. A subtle surface treatment can be reintroduced later as a token.
- [Palette is a proposal] -> Values are isolated in one block, so changing them after review is a one-place edit.
