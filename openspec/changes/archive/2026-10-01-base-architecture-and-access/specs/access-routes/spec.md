## Purpose

Define what visitors and authenticated users see in the web application and how routes are protected.

## ADDED Requirements

### Requirement: Public landing
The route `/` SHALL be reachable without a session and SHALL present Planazo with calls to action leading to login and registration.

#### Scenario: Anonymous visit
- **WHEN** an unauthenticated visitor opens `/`
- **THEN** the landing renders with links to login and register

### Requirement: Login and registration views
The app SHALL provide login and registration forms with client-side validation and visible error feedback for server errors.

#### Scenario: Wrong password feedback
- **WHEN** a user submits wrong credentials
- **THEN** the form stays visible and shows an error message

#### Scenario: Successful login
- **WHEN** a user submits valid credentials
- **THEN** the app navigates to `/mis-planes`

#### Scenario: Successful registration
- **WHEN** a visitor submits a valid registration
- **THEN** the user is signed in and navigated to `/mis-planes`

### Requirement: Password recovery view
The app SHALL provide a recovery view where a user requests a (simulated) token for an email and then sets a new password with it.

#### Scenario: Recovery flow
- **WHEN** a user requests a token and submits it with a new password
- **THEN** the app confirms the change and links back to login

### Requirement: Protected plans route
The route `/mis-planes` SHALL require an active session. Without one, the app MUST redirect to the login view. With one, it SHALL greet the user by name and show a working "Cerrar sesión" button.

#### Scenario: Unauthenticated access
- **WHEN** a visitor opens `/mis-planes` without a session
- **THEN** the app redirects to the login view

#### Scenario: Authenticated access
- **WHEN** a signed-in user opens `/mis-planes`
- **THEN** the welcome message includes the user name

#### Scenario: Logout
- **WHEN** the user presses "Cerrar sesión"
- **THEN** the session ends and the app navigates to the login view

#### Scenario: Refresh keeps session
- **WHEN** a signed-in user refreshes `/mis-planes`
- **THEN** the page still shows the user without asking to log in again

### Requirement: Authenticated users skip auth views
Signed-in users who open the login or registration views SHALL be redirected to `/mis-planes`.

#### Scenario: Already signed in
- **WHEN** a signed-in user opens the login view
- **THEN** the app redirects to `/mis-planes`
