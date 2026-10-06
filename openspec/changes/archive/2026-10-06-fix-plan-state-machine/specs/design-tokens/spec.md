## ADDED Requirements

### Requirement: Solid surfaces, no decorative gradients
Interface components SHALL use solid token colors for backgrounds, buttons, text, and icons. Gradient backgrounds, gradient text, gradient logo fills, and decorative blurred halos SHALL NOT be used.

#### Scenario: No gradients in source
- **WHEN** the frontend source is searched for gradient utilities, gradient definitions, and blur halos
- **THEN** none are found

### Requirement: No infinite decorative animation
The interface SHALL NOT run infinite decorative animations. Transitions SHALL be limited to color, shadow, and dialog or menu entry.

#### Scenario: No looping animation
- **WHEN** the frontend source is searched for infinite animations
- **THEN** none are found

### Requirement: Unused tokens are removed
Tokens that no component consumes (`coral`, `popover` and its foreground, `brand-start`, `brand-mid`, `brand-end`) SHALL be removed from the token definitions, and `apps/frontend/DESIGN.md` SHALL list only existing tokens.

#### Scenario: Removed tokens
- **WHEN** the token definitions and `DESIGN.md` are inspected
- **THEN** the removed tokens are neither defined nor documented as available
