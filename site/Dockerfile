# Package.json version null
FROM node:lts-alpine as preparation
COPY src/package.json ./
RUN ["node", "-e", "\
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));\
fs.writeFileSync('package.json', JSON.stringify({ ...pkg, version: '0.0.0' }));\
"]

# Shared configuration between environments
FROM node:lts-alpine as base
EXPOSE 3000
ENV HOST 0.0.0.0
RUN apk update \
    && apk add curl autoconf automake libtool make tiff jpeg zlib zlib-dev pkgconf nasm file gcc musl-dev
WORKDIR /src

# Development environment
FROM base as development
ENV NODE_ENV=development
RUN mkdir -p /home/node/.cache/yarn
CMD yarn && yarn dev -L

# Provides the source without package.json
FROM base as source-nuller
COPY --chown=node:node src /src
RUN rm /src/package.json

# Builder for production environment
FROM base as production-builder
COPY --from=preparation --chown=node:node package.json ./
COPY --chown=node:node src/yarn.lock ./
RUN yarn --pure-lockfile
COPY --from=source-nuller --chown=node:node /src /src
RUN yarn build

FROM base as production
ENV NODE_ENV=production
HEALTHCHECK --interval=5s --timeout=2s --start-period=10s --retries=3 CMD curl --fail http://localhost:3000/healthcheck || exit 1
COPY --from=production-builder /src/.nuxt ./.nuxt
COPY --from=production-builder /src/package.json ./
COPY --from=production-builder /src/nuxt.config.js ./
COPY --from=production-builder /src/static ./static
COPY --from=production-builder /src/locales ./locales
COPY --from=production-builder /src/node_modules ./node_modules
COPY src/package.json ./
CMD yarn start
