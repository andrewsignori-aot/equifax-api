FROM registry.access.redhat.com/ubi8/nodejs-12:1
#FROM node:12.18.3-slim

LABEL maintainer="BC GOV"

COPY ./package*.json ./

RUN npm ci

COPY . .

RUN npm run build

EXPOSE 3030

CMD [ "npm", "run", "start:prod" ]
