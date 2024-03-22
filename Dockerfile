FROM node:21.6.2-slim

WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install --omit=dev
COPY . .
RUN npm run build
EXPOSE 8080
CMD npm start
