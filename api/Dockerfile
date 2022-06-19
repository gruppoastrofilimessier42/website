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
RUN apk update \
    && apk add curl git
WORKDIR /src

# Development environment
FROM base as development
ENV NODE_ENV=development
RUN mkdir -p /home/node/.cache/yarn
CMD yarn && yarn dev -L

# Builder for production environment
FROM base as production-builder
ENV NODE_ENV=production
COPY --from=preparation --chown=node:node package.json ./
COPY --chown=node:node src/yarn.lock ./
RUN yarn --production --pure-lockfile

# Production environment
FROM base as production
ENV NODE_ENV=production
HEALTHCHECK --interval=5s --timeout=1s --start-period=5s --retries=3 CMD curl --fail http://localhost:3000/healthcheck || exit 1
COPY --from=production-builder --chown=node:node /src ./
COPY --chown=node:node /src ./
CMD yarn start
