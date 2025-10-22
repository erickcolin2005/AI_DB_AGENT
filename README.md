# AI DB Query Agent — Vercel AI SDK (Next.js + PostgreSQL)

NL → SQL → Exec → Tabla + Insights. Seguro, auditable y listo para producción con hardening adicional.

## Requisitos
- Node.js 20+
- Docker + Docker Compose
- `OPENAI_API_KEY`

## Pasos rápidos
1. `cp .env.example .env` y completa variables.
2. `docker compose up -d` (levanta Postgres).
3. `npm i` → `npm run db:migrate` → `npm run db:seed`.
4. `npm run dev` → http://localhost:3000

## Endpoints
- `POST /api/query` → `{ question }` → `{ sql, rows, insights }`
- `GET /api/schema` → esquema usado para el prompt

## Seguridad
- Guard: solo SELECT/WITH, 1 sentencia, bloquea DML/DDL.
- Para prod: AST + parámetros, RLS, límites, auditoría.
