# dg-test

Crypto deposit modal — Next.js 16, Prisma 7, PostgreSQL, Tailwind 4.

---

## Prerequisites

| Tool       | Version |
| ---------- | ------- |
| Node.js    | 20+     |
| pnpm       | 9+      |
| PostgreSQL | 14+     |

---

## Docker (recommended)

Requires [Docker](https://docs.docker.com/get-docker/) with the Compose plugin.

```bash
# docker compose up --build
DB_USERNAME=postgres DB_PASSWORD=postgres DB_NAME=dg_test ADMIN_SECRET=admin-secret docker-compose up --build

```

That's it. Compose will:

1. Start a PostgreSQL 16 container
2. Build the app image
3. Run all Prisma migrations
4. Seed the database
5. Start the app on [http://localhost:3000](http://localhost:3000)

Data persists in a named Docker volume (`postgres_data`). To reset it:

```bash
docker compose down -v
```

---

## Local Setup

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` and set `DATABASE_URL` to point at your local PostgreSQL instance:

```
DATABASE_URL="postgresql://username:password@localhost:5432/dg_test?schema=public"
```

### 3. Run migrations + seed

```bash
pnpm db:migrate   # applies all Prisma migrations
pnpm db:seed      # seeds tokens and networks
```

### 4. Start the dev server

```bash
pnpm dev
```

App available at [http://localhost:3000](http://localhost:3000).

---

## Useful Commands

| Command           | Description                      |
| ----------------- | -------------------------------- |
| `pnpm dev`        | Start dev server with hot reload |
| `pnpm build`      | Production build                 |
| `pnpm start`      | Serve production build           |
| `pnpm test`       | Run Vitest unit tests            |
| `pnpm lint`       | Run ESLint                       |
| `pnpm db:migrate` | Apply pending migrations         |
| `pnpm db:seed`    | Seed database                    |
