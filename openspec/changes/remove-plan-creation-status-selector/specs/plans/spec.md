## MODIFIED Requirements

### Requirement: Plan Creation Form Fields
The plan creation form SHALL prompt ONLY for `description` and `dueDate`. It SHALL NOT display an input or selector for `estado`.

#### Scenario: User creates a new plan
- GIVEN an authenticated user on `/mis-planes`
- WHEN the user opens the "Nuevo plan" form
- THEN the form displays fields for "Descripción" and "Fecha límite"
- AND the form does NOT display an "Estado" field
- WHEN the user submits the form with valid description and dueDate
- THEN the new plan is created with `estado` set to `"pendiente"`
