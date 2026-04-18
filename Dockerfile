FROM node:20-alpine AS base
RUN npm install -g pnpm@10
WORKDIR /app

# ── Stage 1: Install semua dependencies ──────────────────────────────────────
FROM base AS deps
COPY . .
RUN pnpm install --no-frozen-lockfile

# ── Stage 2: Build frontend ───────────────────────────────────────────────────
FROM deps AS frontend-build
ENV NODE_ENV=production
ENV BASE_PATH=/
ENV PORT=3000
RUN pnpm --filter @workspace/event-registration run build

# ── Stage 3: Build backend ────────────────────────────────────────────────────
FROM deps AS backend-build
ENV NODE_ENV=production
RUN pnpm --filter @workspace/api-server run build

# ── Stage 4: Production image ─────────────────────────────────────────────────
FROM base AS production
WORKDIR /app

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY lib/db/package.json ./lib/db/
COPY lib/db/src ./lib/db/src
COPY lib/db/drizzle.config.ts ./lib/db/
COPY lib/db/tsconfig.json ./lib/db/
RUN pnpm install --filter @workspace/db

COPY --from=backend-build /app/artifacts/api-server/dist ./server/dist
COPY --from=frontend-build /app/artifacts/event-registration/dist/public ./server/dist/public

COPY start.sh ./start.sh
RUN chmod +x ./start.sh

ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

CMD ["sh", "start.sh"]
