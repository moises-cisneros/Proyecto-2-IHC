## ADDED Requirements

### Requirement: Brand is a single home link
The navbar SHALL present the Planazo mark and brand name as one link to `/mis-planes` with a single focus and hover target. The navbar SHALL NOT contain a second link to the same destination.

#### Scenario: One target for the brand
- **WHEN** the user hovers or focuses the mark or the brand name
- **THEN** both are part of the same single interactive target that navigates to `/mis-planes`

#### Scenario: No duplicate destination
- **WHEN** the navbar links are inspected
- **THEN** no two links point to `/mis-planes`
