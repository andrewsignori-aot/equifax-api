FROM registry.access.redhat.com/ubi8/nodejs-12:1

LABEL maintainer="BC GOV"

ENV PATH $PATH:/app/node_modules/.bin
ENV PORT 3030
WORKDIR /app

COPY ./package*.json ./

RUN npm ci
COPY . .
RUN npm run build
EXPOSE ${PORT}
CMD [ "npm", "run", "start:prod" ]
