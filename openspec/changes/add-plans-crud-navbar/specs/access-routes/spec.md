## MODIFIED Requirements

### Requirement: Protected plans route
The route `/mis-planes` SHALL require an active session. Without one, the app MUST redirect to the login view. With one, it SHALL greet the user by name, show the navbar with a working "Cerrar sesión" button, and show the user's plans area.

#### Scenario: Unauthenticated access
- **WHEN** a visitor opens `/mis-planes` without a session
- **THEN** the app redirects to the login view

#### Scenario: Authenticated access
- **WHEN** a signed-in user opens `/mis-planes`
- **THEN** the welcome message includes the user name

#### Scenario: Logout
- **WHEN** the user presses "Cerrar sesión" in the navbar
- **THEN** the session ends and the app navigates to the login view

#### Scenario: Refresh keeps session
- **WHEN** a signed-in user refreshes `/mis-planes`
- **THEN** the page still shows the user without asking to log in again
