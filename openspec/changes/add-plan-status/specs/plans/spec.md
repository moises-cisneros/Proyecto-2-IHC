## Purpose

Extends plans management to include an `estado` (status) attribute with three values ("hecho", "retrasado", "pendiente") and displays a color-coded status badge on each plan card.

## MODIFIED Requirements

### Requirement: Plan field validation
A plan SHALL require a non-empty description of at most 500 characters, a valid due date, and an optional `estado` field. When provided, `estado` SHALL be one of `"hecho"`, `"retrasado"`, or `"pendiente"`. If omitted or empty, `estado` SHALL default to `"pendiente"`. Leading and trailing whitespace SHALL be ignored.

#### Scenario: Valid status values accepted
- **WHEN** a plan is created with `estado` set to `"hecho"`, `"retrasado"`, or `"pendiente"`
- **THEN** the plan is accepted and stored with that status

#### Scenario: Invalid status value rejected
- **WHEN** a plan is created with `estado` set to an unknown value like `"archivado"`
- **THEN** the API responds `400` with an error indicating an invalid status value

#### Scenario: Status omitted defaults to pendiente
- **WHEN** a plan is created without specifying `estado`
- **THEN** the plan is created with `estado: "pendiente"`

### Requirement: Plan appears without refresh
After a successful submission, the new plan SHALL appear as a card in the list showing its short ID, description, due date, and status badge without a page reload.

## ADDED Requirements

### Requirement: Plan status badge
Each plan card SHALL visually present its `estado` using a badge that displays the status text and adheres to the following color associations:
- `"hecho"`: green (verde)
- `"retrasado"`: red (rojo)
- `"pendiente"`: blue (azul)

The badge SHALL include text, not color alone, to ensure accessibility.

#### Scenario: Display hecho with green badge
- **WHEN** a plan card is rendered with `estado: "hecho"`
- **THEN** the badge displays "Hecho" and has green styling

#### Scenario: Display retrasado with red badge
- **WHEN** a plan card is rendered with `estado: "retrasado"`
- **THEN** the badge displays "Retrasado" and has red styling

#### Scenario: Display pendiente with blue badge
- **WHEN** a plan card is rendered with `estado: "pendiente"`
- **THEN** the badge displays "Pendiente" and has blue styling
