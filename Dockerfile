FROM node

RUN mkdir -p /usr/local/app

COPY ./node_modules /usr/local/app/node_modules
COPY ./assets/public /usr/local/app/assets/public
COPY ./src /usr/local/app/src
COPY cfg.prv.js /usr/local/app/cfg.prv.js
COPY ./index.js /usr/local/app/index.js

ENTRYPOINT ["node", "/usr/local/app/index.js"]
