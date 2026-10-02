## Purpose

Provide secure account creation, authentication and session handling for Planazo users through an HTTP API.

## ADDED Requirements

### Requirement: User registration
`POST /api/auth/register` SHALL accept `name`, `email` and `password`, create the user with a hashed password, start a session and return the public user (`id`, `email`, `name`, `createdAt`). The password MUST be at least 8 characters, the email MUST be valid and unique (case-insensitive).

#### Scenario: Successful registration
- **WHEN** a client posts valid, unused credentials
- **THEN** the API responds `201` with the public user and sets the session cookie

#### Scenario: Duplicate email
- **WHEN** a client registers an email that already exists
- **THEN** the API responds `409` with an error message and creates no user

#### Scenario: Invalid payload
- **WHEN** a client posts a short password or malformed email
- **THEN** the API responds `400` with field-level error details

### Requirement: User login
`POST /api/auth/login` SHALL verify `email` and `password` and, on success, set an HTTP-only session cookie and return the public user. Failures MUST NOT reveal whether the email exists.

#### Scenario: Valid credentials
- **WHEN** a client posts correct credentials
- **THEN** the API responds `200`, returns the public user and sets an HTTP-only cookie

#### Scenario: Wrong credentials
- **WHEN** the email is unknown or the password is wrong
- **THEN** the API responds `401` with the same generic message in both cases

### Requirement: Current user lookup
`GET /api/auth/me` SHALL return the public user for a valid session cookie and `401` otherwise.

#### Scenario: Session persists across refresh
- **WHEN** a logged-in browser reloads the page and calls `/api/auth/me`
- **THEN** the API returns the same user

#### Scenario: No session
- **WHEN** the request has no valid cookie
- **THEN** the API responds `401`

### Requirement: Logout
`POST /api/auth/logout` SHALL clear the session cookie.

#### Scenario: Logout clears session
- **WHEN** an authenticated client calls logout and then `/api/auth/me`
- **THEN** `/api/auth/me` responds `401`

### Requirement: Password storage
Passwords MUST be stored only as salted bcrypt hashes and MUST NOT appear in any API response or log.

#### Scenario: Hash only
- **WHEN** a user row is inspected in the database
- **THEN** the password column holds a bcrypt hash and never the plain text

### Requirement: Simulated password recovery
`POST /api/auth/recover` with an `email` SHALL simulate sending a recovery message by returning a single-use recovery token (valid 15 minutes) in the response body; no real email is sent. `POST /api/auth/recover/confirm` with `email`, `token` and `newPassword` SHALL replace the password when the token is valid. The request step MUST respond with the same shape for unknown emails.

#### Scenario: Recovery request
- **WHEN** a client requests recovery for an existing email
- **THEN** the API responds `200` with a simulated token

#### Scenario: Recovery for unknown email
- **WHEN** a client requests recovery for an unknown email
- **THEN** the API responds `200` with the same message shape and no token is stored

#### Scenario: Password change with valid token
- **WHEN** a client confirms with a valid token and a valid new password
- **THEN** the password is replaced, the token is invalidated and the user can log in with the new password

#### Scenario: Invalid or expired token
- **WHEN** the token is wrong, used or expired
- **THEN** the API responds `400` and the password is unchanged
