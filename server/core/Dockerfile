# ---- Base Node ----
FROM node:12-alpine AS base

RUN yarn global add pm2

ENV SERVER /server
WORKDIR ${SERVER}

COPY package.json ${SERVER}
COPY yarn.lock ${SERVER}
COPY ecosystem.config.js ${SERVER}
COPY prod.env ${SERVER}

# ---- Dependencies ----
FROM base AS dependencies
RUN yarn install --production

# ---- Build ----
FROM dependencies AS build
COPY . ${SERVER}
RUN yarn build

# ---- Release ----
FROM base AS release

COPY --from=build ${SERVER}/dist ${SERVER}/dist
COPY --from=build ${SERVER}/node_modules ${SERVER}/node_modules

CMD ["pm2-runtime", "start", "ecosystem.config.js"]
