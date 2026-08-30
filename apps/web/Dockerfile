# syntax=docker/dockerfile:1.7
FROM oven/bun:1.3.5-slim AS builder

WORKDIR /app

ENV SKIP_ENV_VALIDATION=1

COPY . .
RUN --mount=type=cache,id=bun-install-cache,target=/root/.bun/install/cache,sharing=locked \
    bun install --frozen-lockfile

ARG NEXT_PUBLIC_SERVER_URL=https://draw.hasibweb.com
ARG API_UPSTREAM_URL=http://server:3000
ARG OPENDRAW_RELEASE=development

ENV NEXT_PUBLIC_SERVER_URL=$NEXT_PUBLIC_SERVER_URL
ENV API_UPSTREAM_URL=$API_UPSTREAM_URL
ENV OPENDRAW_RELEASE=$OPENDRAW_RELEASE

RUN --mount=type=secret,id=SENTRY_AUTH_TOKEN,required=false \
    if [ -f /run/secrets/SENTRY_AUTH_TOKEN ]; then \
      export SENTRY_AUTH_TOKEN="$(cat /run/secrets/SENTRY_AUTH_TOKEN)"; \
    fi; \
    bun run build --filter=web

FROM oven/bun:1.3.5-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY . .
RUN --mount=type=cache,id=bun-install-cache,target=/root/.bun/install/cache,sharing=locked \
    bun install --production --frozen-lockfile
COPY --from=builder /app/apps/web/.next /app/apps/web/.next

ARG NEXT_PUBLIC_SERVER_URL=https://draw.hasibweb.com
ARG API_UPSTREAM_URL=http://server:3000
ARG OPENDRAW_RELEASE=development

ENV NEXT_PUBLIC_SERVER_URL=$NEXT_PUBLIC_SERVER_URL
ENV API_UPSTREAM_URL=$API_UPSTREAM_URL
ENV OPENDRAW_RELEASE=$OPENDRAW_RELEASE

EXPOSE 3001

WORKDIR /app/apps/web
CMD ["bun", "run", "start", "--", "-H", "0.0.0.0", "-p", "3001"]
