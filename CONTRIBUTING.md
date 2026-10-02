# Guía de Contribución - Planazo

¡Gracias por tu interés en contribuir a **Planazo**! Este proyecto es un monorepo orientado al desarrollo ágil y estructurado, integrando desarrollo asistido y guiado por especificaciones con **Gentle-AI** y **OpenSpec**.

Para mantener la consistencia técnica y la calidad del código, todos los colaboradores y agentes automatizados deben seguir estas pautas.

---

## 1. Regla de Oro: Gestor de Paquetes

> [!CAUTION]
> **ESTÁ ESTRICTAMENTE PROHIBIDO EL USO DE `npm` O `yarn`.**
> Todo el ciclo de vida de dependencias, scripts y ejecución del monorepo debe gestionarse **exclusivamente con `pnpm`**.

* **Instalación de dependencias:** `pnpm install`
* **Agregar dependencia en un workspace:** `pnpm --filter <app> add <paquete>`
* **Ejecución de scripts:** `pnpm <script>` o `pnpm --filter <app> <script>`
* **Binarios puntuales:** `pnpm exec <bin>` o `pnpm dlx <paquete>` (nunca `npx`).
* Esta regla es idéntica en [AGENTS.md](AGENTS.md); ambos documentos deben mantenerse alineados.

---

## 2. Requisitos Previos

Asegúrate de contar con las siguientes herramientas instaladas en tu entorno local:

* **Node.js**: `>= 20.x` (LTS recomendada)
* **pnpm**: `>= 9.x` (actívalo con `corepack enable pnpm`)
* **Docker & Docker Compose**: Para orquestar PostgreSQL y los contenedores de desarrollo.
* **Git**: Para el control de versiones.

---

## 3. Arquitectura del Monorepo

El repositorio está organizado como un monorepo basado en workspaces de `pnpm`:

```text
├── apps/
│   ├── frontend/         # React + Vite + TailwindCSS
│   └── backend/          # Node.js + Express + Prisma ORM
├── docs/                 # Documentación técnica y especificaciones de producto
├── openspec/             # Especificaciones, propuestas y cambios de OpenSpec
├── docker-compose.yml    # Orquestación de servicios (db, backend, frontend)
├── pnpm-workspace.yaml   # Configuración de workspaces de pnpm
├── AGENTS.md             # Instrucciones y restricciones para agentes de IA
├── CONTRIBUTING.md       # Esta guía
└── README.md             # Documentación e inicio rápido
```

---

## 4. Inicio Rápido para Desarrollo

1. **Clonar el repositorio:**

   ```bash
   git clone <url-del-repositorio>
   cd Proyecto-2-IHC
   ```

2. **Instalar dependencias del monorepo:**

   ```bash
   pnpm install
   ```

3. **Variables de entorno (opcional):**
   * `docker-compose.yml` ya define valores por defecto de desarrollo. Para personalizarlos copia `.env.example` a `.env` en la raíz.

4. **Levantar el entorno completo:**

   ```bash
   pnpm dev
   ```

   Esto inicia los servicios orquestados en Docker:
   * **Frontend:** `http://localhost:5173`
   * **Backend API:** `http://localhost:3000`
   * **PostgreSQL:** `localhost:5432`

---

## 5. Base de Datos y Seeders

El backend utiliza **Prisma ORM** conectado a PostgreSQL.

### Migraciones

Para aplicar cambios de esquema:

```bash
pnpm --filter backend prisma migrate dev
```

### Seeders de Datos (Usuarios de Prueba)

El proyecto incluye scripts de inicialización de datos para que existan usuarios base desde el primer arranque:

```bash
pnpm --filter backend prisma db seed
```

Desde el host, este comando necesita `DATABASE_URL` apuntando a `localhost:5432` (ver `.env.example`; el servicio `db` publica ese puerto). Dentro de Docker el seed corre automáticamente al iniciar el backend.

*(Consulta el [README.md](README.md) para conocer las credenciales de los usuarios sembrados por defecto).*

---

## 6. Flujo de Trabajo Spec-Driven (Gentle-AI & OpenSpec)

El desarrollo en Planazo sigue la metodología **Spec-Driven Development (SDD)**:

1. **No codificar sin especificación:** Ninguna funcionalidad o cambio de arquitectura se escribe directamente sin antes definir su propuesta y tareas.
2. **Ciclo de OpenSpec:**
   * **Explorar:** Clarificar requerimientos y analizar el estado actual (`/opsx-explore`).
   * **Proponer:** Crear la propuesta formal con deltas de especificación y lista de tareas (`/opsx-propose`).
   * **Implementar:** Ejecutar las tareas paso a paso (`/opsx-apply`).
   * **Sincronizar / Archivar:** Actualizar las especificaciones principales y archivar el cambio completado (`/opsx-archive` o `/opsx-sync`).
3. **Respeto a documentos existentes:** El archivo [docs/project-card.md](docs/project-card.md) contiene la ficha institucional del proyecto y **no debe modificarse**.

---

## 7. Estándares de Código y Commits

* **Conventional Commits:** Todos los mensajes de commit deben seguir el estándar:
  * `feat: <descripción>` para nuevas funcionalidades.
  * `fix: <descripción>` para corrección de bugs.
  * `docs: <descripción>` para cambios en documentación.
  * `refactor: <descripción>` para reestructuración de código sin cambio funcional.
  * `test: <descripción>` para adición o actualización de pruebas.
  * `chore: <descripción>` para tareas de mantenimiento o configuración.
* **Sin atribución de IA:** No incluir firmas de co-autoría automatizadas (`Co-Authored-By: ...`) en los commits.
* **TypeScript & Tipado:** Priorizar tipado estricto en frontend y backend.
* **Validación:** Antes de enviar un pull request o finalizar una tarea, verifica que el linter y las pruebas pasen sin errores.
