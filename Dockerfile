# Creating multi-stage build for production
FROM node:18-alpine
RUN apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev nasm bash

WORKDIR /usr/app

COPY ./package.json ./
COPY ./package-lock.json ./

ARG PORT

RUN npm ci --ignore-scripts

COPY . .

ENV NODE_ENV production

RUN npm run build

EXPOSE ${PORT}

CMD ["npm", "run" ,"start"]
