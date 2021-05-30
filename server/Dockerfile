FROM node:14 as base

WORKDIR /app

COPY ./package.json .
COPY ./package-lock.json .

RUN npm i

COPY . .

FROM base as prod

ENV NODE_PATH=./build

RUN npm run build
