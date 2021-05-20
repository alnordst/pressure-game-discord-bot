FROM gzlock/docker-node-canvas:latest

WORKDIR /usr/src/app

ARG TOKEN
ARG API_URL
ARG PREFIX

ENV TOKEN=$TOKEN
ENV API_URL=$API_URL
ENV PREFIX=$PREFIX

COPY package*.json ./

RUN npm install

COPY . .

CMD [ "node", "index.js" ]