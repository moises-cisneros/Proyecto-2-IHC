## ADDED & MODIFIED Requirements

### Requirement: Plan Deletion Endpoint
The API SHALL provide an endpoint `DELETE /api/plans/:id` requiring authentication.

#### Scenario: Successfully deleting a plan
- GIVEN an authenticated user owning a plan with ID `:id`
- WHEN the user sends a `DELETE /api/plans/:id` request
- THEN the response status is 200 (or 204)
- AND the plan is deleted from the database

#### Scenario: Deleting a non-existent or unowned plan
- GIVEN an authenticated user
- WHEN the user sends a `DELETE /api/plans/:id` request for a plan that does not exist or belongs to another user
- THEN the response status is 404
- AND the response contains `{ message: "Plan no encontrado" }`

#### Scenario: Deleting without authentication
- GIVEN an unauthenticated request
- WHEN sending `DELETE /api/plans/:id`
- THEN the response status is 401

### Requirement: Plan Action Buttons on Plan Card
Each plan card on `/mis-planes` SHALL display two action buttons: "Confirmar" and "Eliminar".

#### Scenario: User clicks "Confirmar"
- GIVEN a plan displayed in `/mis-planes`
- WHEN the user clicks the "Confirmar" button
- THEN the plan's status is changed to `"hecho"` via the status update API
- AND the UI updates the plan's status badge to `"hecho"`

#### Scenario: User clicks "Eliminar"
- GIVEN a plan displayed in `/mis-planes`
- WHEN the user clicks the "Eliminar" button
- THEN a deletion request is sent to `DELETE /api/plans/:id`
- AND upon success, the plan card is removed from the view
