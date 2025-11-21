FROM node:lts AS build

ARG GIT_COMMIT
ARG GIT_COMMIT_SHORT

ENV GIT_COMMIT=$GIT_COMMIT
ENV GIT_COMMIT_SHORT=$GIT_COMMIT_SHORT

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app
COPY package*.json ./
RUN pnpm install
COPY . .
RUN pnpm run build

FROM nginx:alpine AS runtime
COPY --from=build /app/dist /var/html