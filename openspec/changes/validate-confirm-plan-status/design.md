# Design: Validate Plan Confirmation and Disable Button When Already "Hecho"

## Component Changes

### 1. PlanCard.tsx
- Update the "Confirmar" button in `PlanCard.tsx`:
  ```tsx
  <Button
    type="button"
    variant="primary"
    disabled={statusKey === "hecho"}
    onClick={() => onStatusChange?.(plan.id, "hecho")}
  >
    Confirmar
  </Button>
  ```
- This ensures the button is disabled when `statusKey === "hecho"` and enabled for any other status.

### 2. MyPlansPage.tsx
- Add `const [actionError, setActionError] = useState<string | null>(null);`
- In `handleStatusChange`:
  ```tsx
  async function handleStatusChange(id: string, newStatus: PlanStatus) {
    const targetPlan = plans.find((p) => p.id === id);
    if (targetPlan?.estado === "hecho" && newStatus === "hecho") {
      setActionError("Esta acción ya fue confirmada.");
      return;
    }
    setActionError(null);
    const result = await updatePlanStatus(id, newStatus);
    if (!result.ok) {
      setActionError(result.message);
    }
  }
  ```
- Display error in UI:
  ```tsx
  <ErrorAlert message={loadError || actionError} />
  ```
