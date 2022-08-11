FROM node:16.16.0-alpine3.16@sha256:d39ab4712a8395d0b399dea44d9cb8b34ac942411b6a380449ebdb9d321136a3

ENV NODE_ENV production

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 80
CMD [ "node", "server.js" ]
