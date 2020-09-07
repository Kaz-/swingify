# ---- Base Node ----
FROM node:latest AS base

ENV SERVER /server/spotify-manager
WORKDIR ${SERVER}

COPY package.json ${SERVER}

# ---- Dependencies ----
FROM base AS dependencies
RUN npm i --prod

# ---- Build ----
FROM dependencies AS build
COPY . ${SERVER}
RUN npm run build --prod

CMD ["npm", "run", "start:prod"]
