FROM node:12-slim AS build

WORKDIR /www
RUN apt-get update
RUN apt-get install -y make gcc build-essential python yarn
COPY ./.npmrc ./.npmrc
COPY ./package.json ./package.json
COPY ./yarn.lock ./yarn.lock
ENV NODE_ENV=development
RUN yarn install
COPY . /www
ENV NODE_ENV=production
RUN yarn build

FROM node:12-slim AS prod
RUN apt-get -y update
RUN apt-get install -y sqlite3 libsqlite3-dev
WORKDIR /www

ENV NODE_ENV=production
COPY ./package.json ./package.json
COPY ./yarn.lock ./yarn.lock
COPY --from=build /www/.next ./.next
COPY --from=build /www/public/ ./public
COPY ./.npmrc ./.npmrc
RUN yarn install

EXPOSE 80
CMD [ "yarn", "start" ]
