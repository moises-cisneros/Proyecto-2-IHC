## Purpose

Enables users to update a plan's status ("hecho", "retrasado", "pendiente") directly from its card on `/mis-planes`.

## ADDED Requirements

### Requirement: Update plan status via API
The API SHALL provide `PATCH /api/plans/:id` to update a plan's `estado`. The request SHALL require an authenticated session and SHALL only allow modifying plans owned by the authenticated user.

#### Scenario: Valid status update
- **WHEN** an authenticated user sends `PATCH /api/plans/:id` with `{ "estado": "hecho" }` for a plan they own
- **THEN** the API responds `200` with the updated plan and stores the change

#### Scenario: Invalid status update rejected
- **WHEN** a user sends `PATCH /api/plans/:id` with `{ "estado": "cancelado" }`
- **THEN** the API responds `400` with a validation error on `estado`

#### Scenario: Plan not found or owned by another user
- **WHEN** a user attempts to update a plan ID that does not exist or belongs to another user
- **THEN** the API responds `404`

### Requirement: Interactive status selector on plan card
The status badge on `PlanCard` SHALL allow the user to select any of the 3 available states ("hecho", "retrasado", "pendiente"). When selected, the new status SHALL immediately update the card's styling and persist to the backend.

#### Scenario: Change status from Pendiente to Hecho
- **WHEN** a user selects "Hecho" from the status selector on a card
- **THEN** the status updates to "hecho" with green styling and persists without requiring a full page refresh

#### Scenario: Change status from Hecho to Retrasado
- **WHEN** a user selects "Retrasado" from the status selector on a card
- **THEN** the status updates to "retrasado" with red styling and persists

#### Scenario: Change status to Pendiente
- **WHEN** a user selects "Pendiente" from the status selector on a card
- **THEN** the status updates to "pendiente" with blue styling and persists
