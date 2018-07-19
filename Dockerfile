FROM node

RUN mkdir -p /usr/local/app

COPY ./node_modules /usr/local/app/node_modules
COPY ./assets/public /usr/local/app/assets/public

COPY ./src /usr/local/app/src
COPY ./index.js /usr/local/app/index.js

COPY config/cfg.prv.js /usr/local/app/config/cfg.prv.js
COPY config/easter-eggs.prv.js /usr/local/app/config/easter-eggs.prv.js


ENTRYPOINT ["node", "/usr/local/app/index.js"]
