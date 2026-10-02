## Purpose

Defines the single, centralized set of design tokens (color roles, typography scale, spacing scale, and border radius) that gives the Planazo frontend a consistent, accessible visual identity, and the rule that interface code consumes those tokens instead of raw values.

## ADDED Requirements

### Requirement: Centralized token definition
The frontend SHALL define all design tokens in one place, and every token group SHALL be organized as color roles, typography scale, spacing scale, and border radius. No token SHALL be defined twice with different values.

#### Scenario: Tokens are defined once
- **WHEN** a developer looks for the value of a color, text style, spacing step, or radius
- **THEN** exactly one definition exists in the frontend and every screen resolves to it

#### Scenario: Changing a token propagates
- **WHEN** the value of a token is changed in its definition
- **THEN** every screen that uses that token reflects the new value without further edits

### Requirement: Semantic color roles
The token system SHALL provide these color roles: primary, secondary, surface, second surface, success, warning, error, and text. Each role that is used as a background SHALL have a matching foreground token for the content placed on it. Roles SHALL be named by purpose, not by hue.

#### Scenario: All required roles exist
- **WHEN** the token system is inspected
- **THEN** primary, secondary, surface, second surface, success, warning, error, and text roles are all defined

#### Scenario: Foreground paired with background
- **WHEN** a component renders text or icons on a primary, secondary, second surface, success, warning, or error background
- **THEN** it uses the foreground token paired with that background

### Requirement: Accessible color contrast
Every pairing of a foreground token with the background it is designed for SHALL meet a contrast ratio of at least 4.5:1 for normal text. Borders of form controls and other non-text indicators of state SHALL meet at least 3:1 against their adjacent colors. Success, warning, and error states SHALL NOT be communicated by color alone.

#### Scenario: Text pairs meet the threshold
- **WHEN** the contrast ratio of each text foreground/background token pair is measured
- **THEN** every pair is at least 4.5:1

#### Scenario: Form control boundary is visible
- **WHEN** a text input is rendered on the surface background
- **THEN** its border has at least 3:1 contrast against the surface

#### Scenario: Error is not color-only
- **WHEN** a field validation error is shown
- **THEN** the error is conveyed with text in addition to its color

### Requirement: Single-family typography scale
The token system SHALL use one font family for all interface text and SHALL define a named type scale with these styles: heading, subheading, body, body light, label, button, caption, and caption small. Each style SHALL define a size and a weight. No style SHALL have a size below 12px, and the body style SHALL be at least 16px.

#### Scenario: All named styles exist
- **WHEN** the type scale is inspected
- **THEN** heading, subheading, body, body light, label, button, caption, and caption small are all defined with a size and a weight

#### Scenario: Minimum sizes
- **WHEN** the sizes of all type styles are checked
- **THEN** none is smaller than 12px and body is at least 16px

#### Scenario: Font fallback
- **WHEN** the chosen font family fails to load
- **THEN** text renders in a generic sans-serif fallback and remains readable

### Requirement: Spacing scale
The token system SHALL define a named spacing scale with the steps xs, s, m, l, and xl, where each step is a multiple of 4px and each step is larger than the previous one.

#### Scenario: Scale is ordered and on grid
- **WHEN** the spacing steps are compared
- **THEN** xs < s < m < l < xl and every value is a multiple of 4px

### Requirement: Border radius scale
The token system SHALL define one base border radius, and every rounded surface in the interface SHALL use the base radius or a size derived from it.

#### Scenario: Consistent rounding
- **WHEN** inputs, cards, notices, and buttons are rendered
- **THEN** their corner radius comes from the radius tokens

### Requirement: Components consume tokens only
Interface components and pages SHALL reference color, typography, spacing, and radius through tokens. They SHALL NOT use raw color values (hex, rgb, or default palette color names), and the previous loose theme values (ink, muted, paper, line, accent, and the system font stack) SHALL no longer exist.

#### Scenario: No raw colors in components
- **WHEN** the source of the components and pages is searched for hex, rgb, or default palette color names
- **THEN** none are found outside the token definition

#### Scenario: Legacy tokens removed
- **WHEN** the source is searched for the legacy token names
- **THEN** none are referenced and none are defined

### Requirement: No behavior or content change
Applying the token system SHALL NOT change routes, API calls, form behavior, validation rules, or Spanish interface copy.

#### Scenario: Auth flows unchanged
- **WHEN** a user logs in, registers, recovers a password, or logs out after the migration
- **THEN** each flow behaves and reads exactly as before, with only its visual styling changed
