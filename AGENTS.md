# Reglas Operativas para Agentes - Planazo

Este archivo define las directivas y restricciones obligatorias para cualquier agente de inteligencia artificial (Claude, Gentle-AI, Antigravity, OpenCode, Cursor, etc.) que opere en este repositorio. Debe mantenerse alineado con [CONTRIBUTING.md](CONTRIBUTING.md).

---

## 1. Gestor de Paquetes Estricto (Prohibición de `npm` y `yarn`)

> **PROHIBIDO usar `npm`, `npx` y `yarn`.** Todo el ciclo de dependencias, scripts y ejecución se hace **exclusivamente con `pnpm`**.

- **NUNCA ejecutes `npm` ni `yarn`:** ni para instalar paquetes, ni para correr scripts, ni para actualizar dependencias. Tampoco `npx`: usa `pnpm dlx` o `pnpm exec`.
- Activar pnpm (si no está disponible): `corepack enable pnpm`. La versión está fijada en el campo `packageManager` del `package.json` raíz.
- Comandos permitidos:
  - Instalar dependencias: `pnpm install`
  - Levantar el entorno de desarrollo (Docker): `pnpm dev`
  - Detener el entorno: `pnpm down`; ver logs: `pnpm logs`
  - Comandos en workspaces: `pnpm --filter <workspace> <comando>` (ejemplo: `pnpm --filter backend prisma migrate dev`)
  - Agregar paquetes: `pnpm --filter <workspace> add <paquete>`
  - Ejecutar binarios locales: `pnpm exec <bin>` o `pnpm dlx <paquete>`
- No commitear `package-lock.json` ni `yarn.lock`. El único lockfile válido es `pnpm-lock.yaml`.

---

## 2. Metodología Spec-Driven (Gentle-AI & OpenSpec)

Todo desarrollo o cambio de arquitectura debe iniciarse y orquestarse mediante **OpenSpec** con **Gentle-AI**:

1. **Explorar:** `/opsx-explore` para clarificar requerimientos y analizar el estado actual.
2. **Proponer:** `/opsx-propose` crea la propuesta (`proposal`), las especificaciones (`specs`), el diseño (`design`) y las tareas (`tasks`) en `openspec/changes/<cambio>/`.
3. **Implementar:** `/opsx-apply` ejecuta las tareas una a una y las marca como completadas en `tasks.md`.
4. **Sincronizar / Archivar:** `/opsx-sync` y `/opsx-archive` actualizan las especificaciones principales y archivan el cambio.

Reglas:

- No generar código sin tareas y especificaciones previamente aprobadas.
- No editar a mano `proposal.md`, `design.md` ni `specs/` durante `apply`; solo se marcan las casillas de `tasks.md`.
- Los artefactos del flujo (`openspec/`, `.claude/`, `.agent/`, `.cursor/`, `.opencode/`, `.codegraph/`) no se tocan salvo que el cambio lo requiera.

---

## 3. Memoria y contexto: Engram y CodeGraph

- **Engram (memoria persistente):**
  - Antes de volver a deducir una decisión, busca con `mem_search`.
  - Persiste decisiones, bugs resueltos, convenciones y hallazgos con `mem_save` (formato: qué, por qué, dónde, aprendizaje).
  - Cierra cada sesión con `mem_session_summary`.
- **CodeGraph (índice del código):**
  - Para preguntas estructurales (arquitectura, flujo de llamadas, impacto de un cambio) usa `codegraph_explore` **antes** de hacer búsquedas amplias en el sistema de archivos.
  - Comandos de solo lectura permitidos: `codegraph status`, `query`, `explore`, `node`, `files`, `callers`, `callees`, `impact`, `affected`.
  - **Nunca** ejecutes `codegraph uninit`, `install`, `uninstall` ni `upgrade`.

---

## 4. Preservación de Documentación Crítica

- **`docs/project-card.md`:** Es un archivo finalizado con la información del proyecto y sus integrantes. **Es de solo lectura: no debe modificarse, regenerarse ni sobrescribirse.**

---

## 5. Estructura, Docker y Seeders

- Respetar la estructura monorepo: código de aplicación solo en `apps/frontend` y `apps/backend`.
- Mantener la orquestación en `docker-compose.yml` (servicios `db`, `backend`, `frontend`). El flujo normal es `pnpm dev`; para reiniciar desde cero usa `docker compose down -v`.
- Las migraciones de Prisma viven en `apps/backend/prisma/migrations` y se versionan.
- Deben existir seeders para los usuarios de prueba. Se ejecutan automáticamente al iniciar el backend y manualmente con `pnpm --filter backend prisma db seed` (desde el host requiere `DATABASE_URL` apuntando a `localhost:5432`, ver `.env.example`).
- El seeder se niega a ejecutarse con `NODE_ENV=production`.

## 6. Credenciales de prueba

Las credenciales de los usuarios sembrados (solo para pruebas) están documentadas en la sección "Usuarios de prueba" de [README.md](README.md).

## 7. Convenciones

- Código, identificadores y comentarios en inglés; textos de interfaz y documentación en español.
- Conventional Commits y sin atribución de IA en los commits (ver [CONTRIBUTING.md](CONTRIBUTING.md)).
