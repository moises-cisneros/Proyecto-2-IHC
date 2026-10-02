# Planazo

Ayudar a un grupo a organizar un plan.

Monorepo con `pnpm` workspaces: frontend React + Vite + Tailwind, backend Express + Prisma y PostgreSQL, todo orquestado con Docker Compose.

## Requisitos previos

- Docker Desktop (con Docker Compose)
- Node.js >= 20
- pnpm (actívalo con `corepack enable pnpm`)

> Solo se usa `pnpm`. No uses `npm`, `npx` ni `yarn`.

## Inicio rápido

```bash
pnpm install
pnpm dev
```

`pnpm dev` ejecuta `docker compose up --build` y levanta:

| Servicio   | URL                     |
| ---------- | ----------------------- |
| Frontend   | <http://localhost:5173>   |
| API        | <http://localhost:3000>   |
| PostgreSQL | localhost:5432          |

Al iniciar, el backend aplica las migraciones y ejecuta el seed de forma automática. Los cambios en `apps/frontend` y `apps/backend` se recargan sin reiniciar (polling activado para Docker en Windows).

Otros comandos: `pnpm down` (detener), `pnpm logs` (ver logs), `pnpm build` (compilar/verificar tipos).

## Usuarios de prueba

Creados por el seed (solo para pruebas; el seed se niega a correr con `NODE_ENV=production`):

| Nombre      | Correo                 | Contraseña    |
| ----------- | ---------------------- | ------------- |
| Usuario Uno | <usuario1@planazo.com>   | `Planazo123!` |
| Usuario Dos | <usuario2@planazo.com>   | `Planazo123!` |

## Rutas de la aplicación

`/` (landing), `/login`, `/register`, `/recover` y `/mis-planes` (requiere sesión).

## Base de datos: seed y migraciones manuales

Estos comandos se ejecutan desde el host y necesitan que Prisma conozca la base de datos publicada en `localhost:5432`. Define `DATABASE_URL` (ver `.env.example`), por ejemplo en `apps/backend/.env`:

```
DATABASE_URL=postgresql://planazo:planazo@localhost:5432/planazo_db?schema=public
```

```bash
pnpm --filter backend prisma db seed        # equivale a: pnpm seed
pnpm --filter backend prisma migrate dev    # crear/aplicar migraciones en desarrollo
```

Dentro del contenedor también puedes ejecutar `docker compose exec backend pnpm exec prisma db seed`.

## Reiniciar desde cero

Elimina los contenedores y los volúmenes (incluida la base de datos y los `node_modules` anónimos):

```bash
docker compose down -v
pnpm dev
```

## Documentación

- [docs/task-01-access.md](docs/task-01-access.md): arquitectura base y flujo de acceso.
- [AGENTS.md](AGENTS.md) y [CONTRIBUTING.md](CONTRIBUTING.md): reglas para agentes y colaboradores.

## Licencia

Este proyecto está licenciado bajo la licencia MIT. Ver [LICENSE](LICENSE) para más detalles.
