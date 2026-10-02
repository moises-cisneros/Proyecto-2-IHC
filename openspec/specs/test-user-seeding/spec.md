# test-user-seeding Specification

## Purpose

Guarantee that evaluators can log in immediately with known credentials, without registering manually.

## Requirements

### Requirement: Default test users
The seed script SHALL create at least `usuario1@planazo.com` and `usuario2@planazo.com` with known, documented passwords stored hashed.

#### Scenario: Login with seeded user
- **WHEN** the seed has run and a client logs in with a seeded email and its documented password
- **THEN** the login succeeds

### Requirement: Idempotent seeding
Running the seed multiple times SHALL NOT create duplicates or fail.

#### Scenario: Re-run
- **WHEN** `prisma db seed` runs twice
- **THEN** the users table still has exactly one row per seeded email

### Requirement: Automatic and manual execution
The seed SHALL run automatically on backend container start (after migrations) and be runnable manually with `pnpm --filter backend prisma db seed`; credentials SHALL be documented in `README.md`.

#### Scenario: Fresh stack
- **WHEN** `pnpm dev` starts on an empty database
- **THEN** the seeded users exist once the backend is ready
