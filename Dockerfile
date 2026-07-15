FROM node:lts AS builder

ARG GIT_COMMIT
ARG GIT_COMMIT_SHORT

ENV GIT_COMMIT=$GIT_COMMIT
ENV GIT_COMMIT_SHORT=$GIT_COMMIT_SHORT

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

WORKDIR /app

# install deps (better cache)
COPY pnpm-lock.yaml package.json pnpm-workspace.yaml ./
RUN pnpm -v
RUN pnpm install --frozen-lockfile

# build
COPY . .
RUN pnpm run build


# runtime
FROM node:lts-alpine AS runner

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

WORKDIR /app

# only runtime essentials
COPY --from=builder /app/dist ./dist
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm install --prod

ENV HOST=0.0.0.0
ENV PORT=3000

EXPOSE 3000

CMD ["node", "dist/server/entry.mjs"]