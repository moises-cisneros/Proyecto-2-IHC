## MODIFIED Requirements

### Requirement: Plan Confirmation Validation and Disabled State
The "Confirmar" button SHALL be disabled when the plan is already in the `"hecho"` status and enabled for any other status (`"pendiente"`, `"retrasado"`).
If a confirmation attempt occurs on a plan already in the `"hecho"` status, the screen SHALL display the error message: `"Esta acción ya fue confirmada."`.

#### Scenario: Plan already in "hecho" status
- GIVEN a plan with `estado === "hecho"` displayed on `/mis-planes`
- THEN the "Confirmar" button is disabled

#### Scenario: Plan in "pendiente" or "retrasado" status
- GIVEN a plan with `estado === "pendiente"` or `"retrasado"` displayed on `/mis-planes`
- THEN the "Confirmar" button is enabled

#### Scenario: Confirmation attempted when already "hecho"
- GIVEN a plan with `estado === "hecho"`
- WHEN a confirmation action is triggered for this plan
- THEN the screen displays an error message `"Esta acción ya fue confirmada."`
