# syntax=docker/dockerfile:1
FROM node:22-alpine AS base
ENV PNPM_HOME=/pnpm-store
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate \
    && apk add --no-cache openssl bash curl jq

FROM base AS dev
WORKDIR /repo

FROM base AS build
WORKDIR /repo
COPY . .
RUN pnpm install --frozen-lockfile && pnpm turbo run build

FROM base AS prod
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build --chown=node:node /repo /app
USER node
