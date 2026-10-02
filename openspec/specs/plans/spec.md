# plans Specification

## Purpose

Lets a signed-in user create plans (ID, description, due date) and see them as a list of cards that updates instantly and survives a page reload.

## Requirements

### Requirement: Create plan form
The `/mis-planes` screen SHALL show a "Nuevo plan" button. Pressing it SHALL reveal a form with three fields: plan ID, description, and due date, plus a submit button and a cancel control. All field labels and messages SHALL be in Spanish.

#### Scenario: Open the form
- **WHEN** a signed-in user presses "Nuevo plan"
- **THEN** a form with the ID, description, and due date fields is shown

#### Scenario: Cancel the form
- **WHEN** the user cancels the open form
- **THEN** the form closes and no plan is created

### Requirement: Plan field validation
A plan SHALL require a non-empty ID of at most 30 characters, a non-empty description of at most 500 characters, and a valid due date. Leading and trailing whitespace SHALL be ignored. Validation errors SHALL be shown as text next to the offending field and SHALL NOT rely on color alone. The same rules SHALL be enforced by the API.

#### Scenario: Empty fields rejected
- **WHEN** the user submits the form with an empty ID, description, or due date
- **THEN** no plan is created and each invalid field shows a Spanish error message

#### Scenario: Server rejects invalid data
- **WHEN** a client sends `POST /api/plans` with a missing or invalid field
- **THEN** the API responds `400` with an `errors` object keyed by field name

### Requirement: Unique plan ID per user
A plan ID SHALL be unique among the plans of the same user. Two different users MAY use the same ID.

#### Scenario: Duplicate ID
- **WHEN** a user submits a plan whose ID already exists among their plans
- **THEN** the API responds `409` and the form shows an error on the ID field, keeping the typed values

#### Scenario: Same ID, different user
- **WHEN** another user creates a plan with an ID that the first user already has
- **THEN** the plan is created

### Requirement: Plan appears without refresh
After a successful submission the new plan SHALL appear as a card in the list without a page reload, the form SHALL close and reset, and the user SHALL be told the plan was created. Each card SHALL show the plan ID, description, and due date (formatted in Spanish).

#### Scenario: Card appears immediately
- **WHEN** the user submits a valid plan
- **THEN** a card with its ID, description, and due date is visible in the list and the page was not reloaded

#### Scenario: Failure keeps the form
- **WHEN** the request fails because of a network or server error
- **THEN** an error message is shown, the typed values are kept, and no card is added

### Requirement: Plans persist across reloads
Plans SHALL be stored per user in the database. Creating a plan, then reloading the page, SHALL still show that plan.

#### Scenario: Create, reload, still visible
- **WHEN** a user creates a plan, sees its card, and reloads `/mis-planes`
- **THEN** the card is still visible

#### Scenario: Plans are private
- **WHEN** a user lists plans
- **THEN** only plans created by that user are returned

### Requirement: Plans list ordering and empty state
The list SHALL be ordered by due date ascending, with ties broken by creation time ascending. When the user has no plans, the screen SHALL show an empty-state message inviting them to create one.

#### Scenario: Ordering
- **WHEN** a user has plans with different due dates
- **THEN** the earliest due date appears first

#### Scenario: Empty state
- **WHEN** a user with no plans opens `/mis-planes`
- **THEN** an empty-state message is shown instead of cards

### Requirement: Plans API requires a session
`GET /api/plans` and `POST /api/plans` SHALL require a valid session cookie. Without one they SHALL respond `401` and create or return nothing.

#### Scenario: Unauthenticated request
- **WHEN** a client without a session calls `GET /api/plans` or `POST /api/plans`
- **THEN** the API responds `401`

### Requirement: Plan UI follows the design system
The form, cards, and list SHALL consume design tokens only (color roles, type scale, spacing, radius), keep the 4.5:1 text contrast and 3:1 form-control border contrast, and be built in design order: tokens, then atoms, molecules, organisms, and finally the page.

#### Scenario: No raw values
- **WHEN** the plan components are searched for hex, rgb, or default palette color names
- **THEN** none are found
