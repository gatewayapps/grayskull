FROM node:10-slim AS build

WORKDIR /www
RUN apt-get update
RUN apt-get install -y make gcc build-essential python yarn
COPY ./.npmrc ./.npmrc
COPY ./package.json ./package.json
COPY ./yarn.lock ./yarn.lock
RUN NODE_ENV=development
RUN yarn install
COPY . /www
RUN yarn build

FROM node:10-slim AS prod
RUN apt-get -y update
RUN apt-get install -y sqlite3 libsqlite3-dev

WORKDIR /www
ENV NODE_ENV=production
COPY ./package.json ./package.json
COPY ./tsconfig.json ./tsconfig.json
COPY --from=build /www/node_modules ./node_modules
COPY --from=build /www/dist ./dist
COPY --from=build /www/src/templates ./dist/templates
COPY --from=build /www/public/.next ./public/.next
COPY --from=build /www/public/static ./public/static

EXPOSE 80 443
CMD [ "npm", "start" ]
