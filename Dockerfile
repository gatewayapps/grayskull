FROM node:8-slim AS build

WORKDIR /www
COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json
RUN NODE_ENV=development
RUN npm install
COPY . /www
RUN npm run build

FROM node:8-slim AS prod
WORKDIR /www
RUN NODE_ENV=production
COPY ./package.json ./package.json
COPY ./tsconfig.json ./tsconfig.json
COPY --from=build /www/node_modules ./node_modules
COPY --from=build /www/dist ./dist
COPY --from=build /www/public ./public

EXPOSE 3000
CMD [ "npm", "start" ]
