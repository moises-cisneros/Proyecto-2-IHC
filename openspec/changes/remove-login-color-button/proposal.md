# Proposal: Remove Demo Color Toggle Button from LoginPage

## Why

At the start of the project, a demonstration button cycling between red, yellow, and green was added to `LoginPage.tsx` as a proof-of-concept. Now that features are being finalized, this temporary demonstration element should be removed from the login screen to keep the UI clean and production-ready.

## What Changes

- In `apps/frontend/src/pages/LoginPage.tsx`:
  - Remove `COLOR_CYCLE` constant and `colorIndex` state.
  - Remove the demo container and `<button data-testid="color-test-button">`.
- In `apps/frontend/src/pages/LoginPage.test.tsx`:
  - Replace demo button tests with standard unit tests verifying the login form fields and submission behaviors.

## Capabilities

### Modified Capabilities
- `auth`: restores `LoginPage` to a clean authentication form without temporary demo elements.

## Impact

- Frontend: `apps/frontend/src/pages/LoginPage.tsx` and `apps/frontend/src/pages/LoginPage.test.tsx`.
