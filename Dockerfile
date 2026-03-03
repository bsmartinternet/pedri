# ─────────────────────────────────────────────
# Pedri — Dockerfile de producción
# Multi-stage: build limpio, imagen final mínima
# ─────────────────────────────────────────────

# ── Stage 1: instalar dependencias ──
FROM node:20-alpine AS deps
WORKDIR /app

COPY package*.json ./
# Solo dependencias de producción
RUN npm ci --omit=dev && npm cache clean --force


# ── Stage 2: imagen final ──
FROM node:20-alpine AS runner
WORKDIR /app

# Seguridad: usuario no-root
RUN addgroup -g 1001 -S pedri && \
    adduser  -u 1001 -S pedri -G pedri

# Copia dependencias del stage anterior
COPY --from=deps --chown=pedri:pedri /app/node_modules ./node_modules

# Copia el código fuente
COPY --chown=pedri:pedri . .

# Crea directorio de logs con permisos correctos
RUN mkdir -p /app/logs && chown pedri:pedri /app/logs

# Cambia al usuario no-root
USER pedri

# Puerto interno de la app
EXPOSE 3001

# Healthcheck: verifica que el servidor responde
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3001/health || exit 1

# Arranque
CMD ["node", "server.js"]
