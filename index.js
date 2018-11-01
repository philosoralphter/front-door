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

process.on('exit', (exitCode) => {
    console.log('Exiting with code: ', exitCode);
    process.exit();
});

process.on('uncaughtException', (err) => {
    console.log('Caught exception: err');
    process.exit();
});

console.log('Starting Front door server...');

mainServer.start(PORT);

console.log('server Running on port ' + PORT + '.');
