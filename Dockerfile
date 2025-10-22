# --- build stage ---
FROM node:20-bookworm-slim AS build
WORKDIR /app

# Dependencias del sistema (openssl p/ prisma)
RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci --ignore-scripts || npm install --ignore-scripts

COPY . .
# Genera cliente Prisma (no conecta a DB)
RUN npx prisma generate

# Compila Next.js
RUN npm run build

# --- runtime stage ---
FROM node:20-bookworm-slim
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1

# openssl también en runtime
RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

COPY --from=build /app ./
EXPOSE 3000

# Migraciones en runtime y arranque
CMD sh -c "npx prisma migrate deploy || true; npm run start"