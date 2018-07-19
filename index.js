const _ = require('lodash');

const mainServer = require('./src/server/main-server.js');


let DEFAULT_DEV_PORT = 3000;
let PORT = process.env.PORT;


if (_.isUndefined(PORT)) {
    console.warn('Warning: No PORT set, using default dev port: ' + DEFAULT_DEV_PORT);
    PORT = DEFAULT_DEV_PORT;
}

process.on('SIGINT', () => {
    console.log('Exiting...');
    process.exit(0);
});

console.log('Starting Front door server...');

mainServer.start(3000);

console.log('server Running on port ' + PORT + '.');
