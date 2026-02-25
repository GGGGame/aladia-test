# Stage 1: Build
FROM node:20-alpine AS build
ARG APP_NAME
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx nest build ${APP_NAME}

# Stage 2: Runtime
FROM node:20-alpine
ARG APP_NAME
RUN apk add --no-cache netcat-openbsd
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY package*.json ./

ENV APP_MAIN_FILE=dist/apps/${APP_NAME}/main
CMD node ${APP_MAIN_FILE}
