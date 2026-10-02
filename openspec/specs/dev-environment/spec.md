# dev-environment Specification

## Purpose

Define the monorepo layout, package-manager policy and container orchestration that let any developer run Planazo with a single command.

## Requirements

### Requirement: Monorepo layout
The repository SHALL be a pnpm workspaces monorepo declared in `pnpm-workspace.yaml`, with application code only under `apps/frontend` and `apps/backend`.

#### Scenario: Workspaces are discoverable
- **WHEN** a developer runs `pnpm -r list --depth -1`
- **THEN** the workspaces `frontend` and `backend` are listed

### Requirement: pnpm-only tooling
All dependency, script and execution commands SHALL use `pnpm`. `npm` and `yarn` MUST NOT be used, and this rule SHALL be stated explicitly in `AGENTS.md` and `CONTRIBUTING.md`.

#### Scenario: Rule is documented for agents
- **WHEN** an agent reads `AGENTS.md`
- **THEN** it finds an explicit prohibition of `npm` and `yarn` and the mandatory use of `pnpm`

### Requirement: Docker Compose services
`docker-compose.yml` at the repository root SHALL define the services `db` (PostgreSQL with database `planazo_db`), `backend` (port 3000) and `frontend` (port 5173), with source volumes mounted for hot reload and the backend depending on a healthy `db`.

#### Scenario: Stack starts
- **WHEN** the stack is started
- **THEN** PostgreSQL accepts connections, the API answers on `http://localhost:3000` and the web app answers on `http://localhost:5173`

### Requirement: Single start command with hot reload
The root `package.json` SHALL expose `pnpm dev` which builds and starts the Docker Compose stack. Editing a source file in `apps/frontend` or `apps/backend` SHALL be reflected in the running container without a manual restart.

#### Scenario: Backend edit reloads
- **WHEN** a backend source file is saved while the stack is running
- **THEN** the backend process restarts automatically

#### Scenario: Frontend edit reloads
- **WHEN** a frontend source file is saved while the stack is running
- **THEN** the browser reflects the change without a manual rebuild

### Requirement: Protected project card
`docs/project-card.md` SHALL NOT be modified, regenerated or overwritten by this change.

#### Scenario: Card unchanged
- **WHEN** the change is complete
- **THEN** `git diff` shows no modification to `docs/project-card.md`
