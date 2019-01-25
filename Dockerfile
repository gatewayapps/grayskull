FROM node:8-slim AS build

WORKDIR /www
COPY ./package.json ./package.json
RUN apt-get update
RUN apt-get install -y make gcc build-essential
#COPY ./package-lock.json ./package-lock.json
RUN NODE_ENV=development
RUN npm install
COPY . /www
RUN npm run build

FROM node:8-slim AS prod
RUN apt-get -y update
RUN apt-get install -y sqlite3 libsqlite3-dev

WORKDIR /www
ENV NODE_ENV=production
COPY ./package.json ./package.json
COPY ./tsconfig.json ./tsconfig.json
COPY --from=build /www/node_modules ./node_modules
COPY --from=build /www/dist ./dist
COPY --from=build /www/public/.next ./public/.next
COPY --from=build /www/public/static ./public/static

EXPOSE 80 443
CMD [ "npm", "start" ]
