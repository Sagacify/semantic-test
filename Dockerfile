FROM node:14-alpine

WORKDIR /var/www

COPY ./config /var/www/config
COPY ./src /var/www/src
COPY ./test /var/www/test
COPY ./package.json /var/www/package.json
COPY ./package-lock.json /var/www/package-lock.json

RUN npm ci

CMD [ "npm", "start", "--silent" ]
