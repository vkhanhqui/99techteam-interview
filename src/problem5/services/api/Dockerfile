FROM node:22.16.0-alpine

WORKDIR /app
COPY services/api services/api
COPY services/api/.env.dist services/api/.env

COPY package.json .
COPY package-lock.json .
COPY tsconfig.json .

RUN npm install

WORKDIR /app/services/api
CMD ["npm", "start"]