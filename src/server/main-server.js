const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const welcome = require('../operators/1290-main-menu/welcome.js');
const entrypoint = require('../operators/1290-main-menu/entrypoint');

let publicAssetsDir = path.join(__dirname + '../../../assets/public');

const app = express();



// Config
app.use(bodyParser.urlencoded());
app.use('/assets', express.static(publicAssetsDir));



//Routes
app.post('/', (req, resp, next) => {
    console.log('Incoming Request: ', req.body);

    let response = entrypoint.main();

    resp.set({'Content-Type': 'text/xml'});

    resp.write(response);
    resp.status(200).send();
});

app.post('/handle-input', (req, resp, next) => {
    console.log('Incoming Request: ', req.body);

    let response = entrypoint.handleInput(req.body);

    resp.set({'Content-Type': 'text/xml'});

    resp.write(response);
    resp.status(200).send();
});

app.post('/check-code', (req, resp, next) => {
    console.log('Incoming Request: ', req.body);

    let response = entrypoint.checkCode(req.body);

    resp.set({'Content-Type': 'text/xml'});

    resp.write(response);
    resp.status(200).send();
});


//Fallback
app.post('/welcome', (req, resp, next) => {
    console.log('Incoming Request: ', req.body);

    let response = welcome();

    resp.set({'Content-Type': 'text/xml'});

    resp.write(response);
    resp.status(200).send();
});



//Fallback
app.use('/', (err, req, resp, next) => {
    console.log('Incoming Request Failed to Route: ', req.path, err);
    resp.status(500).write(entrypoint.noAccess()).send();
    next();
});



module.exports = {
    app: app,
    start: function (port) {
        app.listen(port);
    }
};

