FROM node:8-slim

WORKDIR /www
COPY ./package.json /www/package.json
RUN npm install
COPY . /www
EXPOSE 3000
CMD [ "npm", "start" ]