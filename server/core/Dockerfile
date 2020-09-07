# ---- Base Node ----
FROM node:latest AS base

ENV SERVER /server
WORKDIR ${SERVER}

COPY package.json ${SERVER}

# ---- Dependencies ----
FROM base AS dependencies
RUN npm i --only=prod

# ---- Build ----
FROM dependencies AS build
COPY . ${SERVER}
RUN npm run build --prod

# ---- Release ----
FROM node:latest

ENV SERVER /server
WORKDIR ${SERVER}

COPY --from=build ${SERVER}/package.json ${SERVER}
COPY --from=build ${SERVER}/dist ${SERVER}/dist
COPY --from=build ${SERVER}/prod.env ${SERVER}
COPY --from=build ${SERVER}/node_modules ${SERVER}/node_modules

CMD ["npm", "run", "start:prod"]
