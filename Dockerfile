# Install dependencies only when needed
FROM node:22-alpine AS base
RUN apk add --no-cache openssl libc6-compat

FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY ./package*.json ./
RUN npm ci --legacy-peer-deps

# Rebuild the source code only when needed
FROM base AS builder
ARG HOST_BASE_URL
ARG BASE_URL
# The container serves on 3000 (see runner stage); baked into server-side API calls.
ENV INTERNAL_BASE_URL=http://127.0.0.1:3000
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run schema
RUN npm run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/public ./public

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000
# Listen on all interfaces so server-side calls to 127.0.0.1:3000 reach the app.
ENV HOSTNAME 0.0.0.0
CMD ["node", "server.js"]
