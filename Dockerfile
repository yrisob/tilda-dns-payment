# Creating multi-stage build for production
FROM node:18-alpine
RUN apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev nasm bash

WORKDIR /usr/app

COPY ./package.json ./

RUN npm install

COPY . .

ENV NODE_ENV production

RUN npm run build

EXPOSE 1337

CMD ["npm", "run" ,"start"]
