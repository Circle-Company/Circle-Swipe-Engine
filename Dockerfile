FROM node:alpine
WORKDIR /usr/app

COPY package*.json ./
RUN npm install

COPY . .
EXPOSE 5000

CMD ["node", "./build/connection/server/index.js"]