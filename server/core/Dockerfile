# ---- Base Node ----
FROM node:12 AS base

ENV SERVER /home/pereira/Workspace/swingify/server/core
WORKDIR ${SERVER}

COPY package*.json .

# ---- Dependencies ----
FROM base AS dependencies
# install node packages
RUN npm i --production
# copy production node_modules aside
RUN cp -R node_modules prod_node_modules
# install ALL node_modules, including 'devDependencies'
RUN npm i

# ---- Build ----
FROM dependencies AS build
COPY . .
RUN npm run build --prod

# ---- Release ----
FROM base AS release
# copy production node_modules
COPY --from=build ${SERVER}/prod_node_modules ./node_modules
# copy MongoDB schemas
COPY --from=build ${SERVER}/src/schemas ./src/schemas
# copy app sources
COPY --from=build ${SERVER}/dist .

CMD ["node", "main.js"]
