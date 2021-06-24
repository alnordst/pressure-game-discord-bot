FROM gzlock/docker-node-canvas:latest

WORKDIR /usr/src/app

ARG TOKEN
ARG API_URL
ARG THIS_URL
ARG ERROR_CHANNEL

ENV TOKEN=$TOKEN
ENV API_URL=$API_URL
ENV THIS_URL=$THIS_URL
ENV ERROR_CHANNEL=$ERROR_CHANNEL

COPY package*.json ./

RUN npm install

COPY . .

CMD [ "node", "src/app.js" ]