# Proposal: Style Plan Action Buttons (Confirmar & Eliminar)

## Why

To improve visual consistency with the application design:
- The "Confirmar" button should match the visual appearance of the primary action buttons, specifically the "Nuevo plan" button (`variant="primary"` / `bg-primary text-on-primary`).
- The "Eliminar" button should match the distinctive colors of the "Retrasado" status (`bg-rose-100 text-rose-800 border-rose-300` / `#ffe4e6` background with `#9f1239` text).

## What Changes

- In `apps/frontend/src/components/molecules/PlanCard.tsx`:
  - Set the "Confirmar" button to use `variant="primary"` (same as "Nuevo plan").
  - Set the "Eliminar" button to use the "retrasado" status styling (`bg-rose-100 text-rose-800 border-rose-300 hover:bg-rose-200` and inline styles `{ backgroundColor: "#ffe4e6", color: "#9f1239", borderColor: "#fca5a5" }`).
- Update and add unit tests in `PlanCard.test.tsx` verifying the updated button styling.

## Capabilities

### Modified Capabilities
- `plans`: visually updates the "Confirmar" and "Eliminar" action buttons on the plan card.

## Impact

- Frontend: `apps/frontend/src/components/molecules/PlanCard.tsx` and `apps/frontend/src/components/molecules/PlanCard.test.tsx`.
