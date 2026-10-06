# Design: Remove Demo Color Toggle Button from LoginPage

## Implementation Details

### 1. LoginPage.tsx
Remove:
```tsx
const COLOR_CYCLE = [
  { name: "Rojo", bg: "#dc2626", text: "#ffffff" },
  { name: "Amarillo", bg: "#facc15", text: "#1f1b2e" },
  { name: "Verde", bg: "#16a34a", text: "#ffffff" },
];
```
and `const [colorIndex, setColorIndex] = useState(0);`.
Remove lines 75-89 containing the demo button markup.

### 2. LoginPage.test.tsx
Replace the 4 demo button tests with 4 unit tests verifying the login form:
1. Renders email, password inputs, submit button, and recovery/register links.
2. Validates empty email and password submission.
3. Validates invalid email format.
4. Verifies `color-test-button` is not present in the DOM.
