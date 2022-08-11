FROM node:16.16.0-alpine3.16@sha256:d39ab4712a8395d0b399dea44d9cb8b34ac942411b6a380449ebdb9d321136a3

ENV NODE_ENV production

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --only=production

# Bundle app source
COPY . .

ENV PORT 80
ENV MONGO_APP_URL mongodb://kadira-db:27017/apm
ENV MONGO_SHARD_URL_one mongodb://kadira-db:27017/apm
ENV MAIL_URL smtp://user:pass@smtp.mailgun.org:587
ENV AUTH_SECRET secret
ENV JWT_SECRET secret
ENV JWT_LIFETIME 1d

EXPOSE 80
CMD [ "node", "server.js" ]
