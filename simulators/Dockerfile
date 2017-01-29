FROM node:7.4-alpine
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app/
RUN npm install

COPY lib /usr/src/app
CMD ["node","index.js"]