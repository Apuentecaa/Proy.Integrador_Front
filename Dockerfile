# ===================================================================
#  Frontend SmartSalud — Next.js 16 / React 19
#  Build multi-stage: compila y luego sirve con `next start`
# ===================================================================

# ---------- Stage 1: build ----------
FROM node:20-alpine AS build
WORKDIR /app

# Instala dependencias (cacheado por package.json)
COPY package.json package-lock.json* ./
RUN npm install

# Copia el codigo y compila
COPY . .

# NEXT_PUBLIC_* se "hornea" en build. El navegador (host) llama al backend
# en http://localhost:8080, que es el puerto publicado por compose.
ARG NEXT_PUBLIC_API_URL=http://localhost:8080
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN npm run build

# ---------- Stage 2: runtime ----------
FROM node:20-alpine
WORKDIR /app

ENV NODE_ENV=production

# Copiamos el build completo (node_modules + .next + public + config)
COPY --from=build /app ./

EXPOSE 3000

CMD ["npm", "start"]
