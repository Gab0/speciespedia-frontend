FROM node:latest

COPY . /species-frontend

WORKDIR /species-frontend

RUN npm install

RUN npm install -g serve

ENV NODE_OPTIONS=--openssl-legacy-provider
RUN npm run build

ENTRYPOINT ["serve", "-s", "build"]
