# Design: Style Plan Action Buttons

## Component Changes

### PlanCard.tsx
1. "Confirmar" button:
   ```tsx
   <Button
     type="button"
     variant="primary"
     onClick={() => onStatusChange?.(plan.id, "hecho")}
   >
     Confirmar
   </Button>
   ```
   This matches the "Nuevo plan" button which renders `<Button variant="primary">` with `bg-primary px-l text-on-primary`.

2. "Eliminar" button:
   ```tsx
   <Button
     type="button"
     variant="secondary"
     style={STATUS_CONFIG.retrasado.style}
     className={`border font-semibold hover:opacity-90 ${STATUS_CONFIG.retrasado.className}`}
     onClick={() => onDelete?.(plan.id)}
   >
     Eliminar
   </Button>
   ```
   This explicitly reuses `STATUS_CONFIG.retrasado.style` (`backgroundColor: "#ffe4e6"`, `color: "#9f1239"`, `borderColor: "#fca5a5"`) and `STATUS_CONFIG.retrasado.className`.

### Testing
- In `PlanCard.test.tsx`, add assertions checking that the "Confirmar" button has primary styling class and that "Eliminar" button has the computed background/color styles matching "retrasado".
