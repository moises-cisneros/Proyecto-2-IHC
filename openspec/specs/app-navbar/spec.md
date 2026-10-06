# app-navbar Specification

## Purpose

Provides a persistent navbar on authenticated screens that holds the brand mark, the user's profile icon, and the session logout action.

## Requirements

### Requirement: Navbar on authenticated screens
Authenticated screens SHALL render a navbar at the top containing the Planazo mark on one side and, on the other, a profile icon and a "Cerrar sesión" button. The navbar SHALL NOT appear on login, registration, recovery, or landing views.

#### Scenario: Navbar content
- **WHEN** a signed-in user opens `/mis-planes`
- **THEN** the navbar shows the Planazo mark, a profile icon, and a "Cerrar sesión" button

#### Scenario: Not shown to visitors
- **WHEN** a visitor opens the login view
- **THEN** no navbar with profile icon or logout button is shown

### Requirement: Profile icon identifies the user
The profile icon SHALL have an accessible name that includes the signed-in user's name, and SHALL NOT be the only means of conveying that information to assistive technology.

#### Scenario: Accessible name
- **WHEN** the profile icon is inspected by assistive technology
- **THEN** its accessible name includes the user's name

### Requirement: Logout from the navbar
Pressing "Cerrar sesión" in the navbar SHALL end the session and navigate to the login view. While the request is pending the button SHALL be disabled.

#### Scenario: Logout works
- **WHEN** the user presses "Cerrar sesión" in the navbar
- **THEN** the session ends and the app shows the login view

#### Scenario: Double press prevented
- **WHEN** logout is in progress
- **THEN** the button is disabled

### Requirement: Navbar uses tokens and is usable on small screens
The navbar SHALL consume design tokens only, keep interactive targets at least 44px high, and remain fully visible and operable at a 320px viewport width without horizontal scrolling.

#### Scenario: Narrow viewport
- **WHEN** the viewport is 320px wide
- **THEN** the mark, profile icon, and logout button are all visible and usable

### Requirement: Brand is a single home link
The navbar SHALL present the Planazo mark and brand name as one link to `/mis-planes` with a single focus and hover target. The navbar SHALL NOT contain a second link to the same destination.

#### Scenario: One target for the brand
- **WHEN** the user hovers or focuses the mark or the brand name
- **THEN** both are part of the same single interactive target that navigates to `/mis-planes`

#### Scenario: No duplicate destination
- **WHEN** the navbar links are inspected
- **THEN** no two links point to `/mis-planes`
