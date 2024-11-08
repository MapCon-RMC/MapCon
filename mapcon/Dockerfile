FROM node:22-alpine

WORKDIR "/app"

COPY package.json package-lock.json .env ./

COPY prisma/ ./prisma/

RUN corepack enable npm && \
    corepack use npm@latest-9 && \
    npm ci

# RUN pnpm exec prisma db push && \
RUN pnpm exec prisma generate

EXPOSE 3001

ENTRYPOINT ["/usr/bin/env", "pnpm"]