FROM node:20 AS builder
WORKDIR /app

COPY package*.json ./
RUN pnpm install

COPY . .
RUN pnpm run build    # produces /app/dist

FROM alpine:latest
WORKDIR /site
COPY --from=builder /app/dist ./
