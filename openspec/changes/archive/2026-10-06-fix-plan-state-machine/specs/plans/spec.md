## ADDED Requirements

### Requirement: Plan card shows state and confirm action
Each plan card SHALL display its state as a text badge ("Borrador" or "Confirmado"); the state SHALL NOT be editable through a dropdown or select. A card in `borrador` SHALL show an explicit button labelled "Confirmar plan". A card in `confirmado` SHALL show a "Confirmado" badge with a check icon and SHALL NOT show a confirm button. State SHALL NOT be conveyed by color alone.

#### Scenario: Draft card
- **WHEN** a plan in `borrador` is listed
- **THEN** its card shows a "Borrador" badge and a "Confirmar plan" button

#### Scenario: Confirmed card
- **WHEN** a plan in `confirmado` is listed
- **THEN** its card shows a "Confirmado" badge with a check icon and no confirm button

### Requirement: Confirmation dialog before confirming
Pressing "Confirmar plan" SHALL open a dialog that names the plan and states that the plan will not return to draft. The state SHALL change only after the user accepts. While the request is pending the accept control SHALL be disabled.

#### Scenario: Accept
- **WHEN** the user accepts the dialog
- **THEN** the plan becomes `confirmado` on its card without a page reload

#### Scenario: Cancel
- **WHEN** the user cancels the dialog
- **THEN** the plan stays `borrador` and no request is sent

#### Scenario: Failure
- **WHEN** the confirm request fails
- **THEN** an error message is shown and the card keeps its previous state

### Requirement: Card actions menu
Each plan card SHALL expose secondary actions through a three-dot menu button with an accessible name (for example "Más acciones") and an interactive target of at least 44px. The menu SHALL be operable with the keyboard. The menu SHALL contain "Eliminar", styled as destructive. The card SHALL NOT show a standalone large delete button.

#### Scenario: Open the menu
- **WHEN** the user activates the three-dot button
- **THEN** a menu with "Eliminar" is shown

#### Scenario: Keyboard use
- **WHEN** the user opens the menu with the keyboard and presses Escape
- **THEN** the menu closes and focus returns to the three-dot button

### Requirement: Delete requires confirmation
Choosing "Eliminar" SHALL open a dialog that names the plan and asks for confirmation. The plan SHALL be deleted only after the user accepts, and SHALL disappear from the list without a page reload.

#### Scenario: Confirm delete
- **WHEN** the user accepts the delete dialog
- **THEN** the plan is deleted, removed from the list, and does not return after a reload

#### Scenario: Cancel delete
- **WHEN** the user cancels the delete dialog
- **THEN** the plan remains in the list

### Requirement: Plan creation does not expose state
The plan creation form SHALL NOT offer a state field. The API SHALL ignore any state sent on creation.

#### Scenario: Form fields
- **WHEN** the user opens the "Nuevo plan" form
- **THEN** it contains description and due date fields and no state control
