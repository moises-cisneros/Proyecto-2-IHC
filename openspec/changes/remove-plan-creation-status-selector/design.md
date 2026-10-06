# Design: Default Plan Status and Remove Status Selector on Creation

## Architecture Decisions

### 1. Form state simplification in PlanForm
In `PlanForm.tsx`, remove `estado` from local state (`useState<PlanStatus>("pendiente")`). When preparing the submission payload in `handleSubmit`:
```ts
const values: PlanInput = { description: description.trim(), dueDate, estado: "pendiente" };
```
Remove the `<select id="plan-estado">` element and its label from JSX.

### 2. Testing strategy
Update `PlanForm.test.tsx`:
- Update the field checking test to assert `expect(screen.queryByLabelText("Estado")).not.toBeInTheDocument()`.
- Replace or update the test "allows selecting a custom estado" with verification that creation always defaults to `"pendiente"`.
- Run frontend test suite with Vitest to ensure all tests pass.
