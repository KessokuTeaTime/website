# ---- Build stage ----
FROM node:20 AS builder
WORKDIR /app

# Dependencies
COPY package*.json ./
RUN pnpm install

# Build Astro
COPY . .
RUN pnpm run build    # produces /app/dist

# ---- Final stage ----
FROM alpine:latest
WORKDIR /site
COPY --from=builder /app/dist ./
