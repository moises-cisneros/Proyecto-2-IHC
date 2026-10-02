# Tarea 1: Arquitectura base y acceso

## Modalidad de trabajo

Desarrollo asistido por IA y guiado por especificaciones (spec-driven) con **Gentle-AI** y **OpenSpec**. El cambio `base-architecture-and-access` (en `openspec/changes/base-architecture-and-access/`) contiene la propuesta, las especificaciones, el diseño y las tareas; la implementación siguió esas tareas en orden.

## Decisiones de arquitectura

| Decisión | Detalle |
| --- | --- |
| Monorepo | `pnpm` workspaces: `apps/frontend` y `apps/backend`. Solo `pnpm`, sin `npm` ni `yarn`. |
| Lenguaje | TypeScript en ambas aplicaciones (el backend se ejecuta con `tsx`). |
| Base de datos | PostgreSQL 16 (servicio `db`, base `planazo_db`) con Prisma 6 y migraciones versionadas. |
| Sesión | JWT en cookie HTTP-only `planazo_session`, `SameSite=Lax`, 7 días, `secure` solo en producción. |
| Mismo origen | El navegador solo habla con `:5173`; Vite redirige `/api` a `http://backend:3000` (configurable con `VITE_API_PROXY_TARGET`). CORS con credenciales para `http://localhost:5173` como respaldo. |
| Contraseñas | `bcryptjs` (coste 10); nunca se devuelven ni se registran. |
| Validación | `zod` en cada endpoint; errores como `{ message, errors? }`. |
| Recuperación | Simulada: se guarda el hash SHA-256 de un token aleatorio (15 min) y el token se devuelve en la respuesta en lugar de enviar un correo. Solo para desarrollo. |
| Docker | Un `Dockerfile.dev` por aplicación, contexto en la raíz, `node:22-bookworm-slim`, volúmenes de código para recarga en caliente (`nodemon --legacy-watch` y Vite con polling). |
| Arranque del backend | `prisma generate`, `prisma migrate deploy`, `prisma db seed` y luego `pnpm dev`. |

## Estructura de datos: `User`

| Campo | Tipo | Notas |
| --- | --- | --- |
| `id` | `String` (UUID) | Clave primaria. |
| `email` | `String` | Único; se normaliza a minúsculas. |
| `passwordHash` | `String` | Hash bcrypt; nunca se expone. |
| `name` | `String` | Nombre visible. |
| `resetTokenHash` | `String?` | SHA-256 del token de recuperación vigente. |
| `resetTokenExpiresAt` | `DateTime?` | Vencimiento del token (15 min). |
| `createdAt` | `DateTime` | Por defecto `now()`. |
| `updatedAt` | `DateTime` | Se actualiza automáticamente. |

El usuario público devuelto por la API contiene solo `id`, `email`, `name` y `createdAt`.

## Endpoints

| Método | Ruta | Descripción | Respuestas |
| --- | --- | --- | --- |
| GET | `/api/health` | Estado del servicio. | 200 |
| POST | `/api/auth/register` | Crea la cuenta e inicia sesión. | 201, 400, 409 |
| POST | `/api/auth/login` | Inicia sesión (mensaje genérico en fallos). | 200, 401 |
| POST | `/api/auth/logout` | Borra la cookie de sesión. | 200 |
| GET | `/api/auth/me` | Usuario de la sesión actual. | 200, 401 |
| POST | `/api/auth/recover` | Genera el token y lo devuelve en el cuerpo. | 200, 400 |
| POST | `/api/auth/recover/confirm` | Cambia la contraseña con `email`, `token` y `newPassword`. | 200, 400 |

## Rutas de la aplicación

| Ruta | Acceso | Archivo |
| --- | --- | --- |
| `/` | Pública | `apps/frontend/src/pages/LandingPage.tsx` |
| `/login` | Solo invitados (con sesión redirige a `/mis-planes`) | `apps/frontend/src/pages/LoginPage.tsx` |
| `/register` | Solo invitados | `apps/frontend/src/pages/RegisterPage.tsx` |
| `/recover` | Pública | `apps/frontend/src/pages/RecoverPage.tsx` |
| `/mis-planes` | Requiere sesión (si no, redirige a `/login`) | `apps/frontend/src/pages/MyPlansPage.tsx` |

## Mapa de archivos del flujo de acceso

```text
apps/backend/
  prisma/schema.prisma, prisma/migrations/, prisma/seed.ts
  src/app.ts, src/server.ts
  src/routes/auth.ts               # endpoints de autenticación
  src/middleware/requireAuth.ts    # valida la cookie de sesión
  src/lib/{config,prisma,session,schemas,publicUser}.ts
apps/frontend/
  vite.config.ts                   # proxy /api, polling, host
  src/main.tsx, src/App.tsx        # enrutado
  src/api/client.ts                # fetch con credenciales
  src/auth/AuthContext.tsx         # AuthProvider (GET /api/auth/me al cargar)
  src/auth/routes.tsx              # ProtectedRoute y GuestRoute
  src/components/ui.tsx            # componentes base accesibles
  src/pages/                       # Landing, Login, Register, Recover, MyPlans
docker-compose.yml, apps/*/Dockerfile.dev
```

## Usuarios de prueba

`usuario1@planazo.com` y `usuario2@planazo.com`, contraseña `Planazo123!` (ver `README.md`). El seed es idempotente (`upsert` por correo) y no se ejecuta con `NODE_ENV=production`.
