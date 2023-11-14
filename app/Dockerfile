FROM node:18.17.1
COPY . /home/app
WORKDIR /home/app

RUN npm ci

EXPOSE 8001

CMD npm start
