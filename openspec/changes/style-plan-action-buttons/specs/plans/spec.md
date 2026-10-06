## MODIFIED Requirements

### Requirement: Plan Action Buttons Styling
The "Confirmar" and "Eliminar" action buttons on each plan card SHALL have specific styling:

#### Scenario: "Confirmar" button styling
- GIVEN a plan card displayed on `/mis-planes`
- THEN the "Confirmar" button is styled as a primary button with `variant="primary"` (matching the "Nuevo plan" button)

#### Scenario: "Eliminar" button styling
- GIVEN a plan card displayed on `/mis-planes`
- THEN the "Eliminar" button is styled with the colors of the "retrasado" status badge (`backgroundColor: #ffe4e6`, `color: #9f1239`, `borderColor: #fca5a5`)
