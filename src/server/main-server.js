const path = require('path')
const express = require('express');

const welcome = require('../operators/welcome.js');

let publicAssetsDir = path.join(__dirname + '../../../assets/public');
console.log('dirname: ', __dirname)

const app = express();

app.use('/assets', express.static(publicAssetsDir));
console.log('public assets at: ', publicAssetsDir);


app.post('/', (req, resp, next) => {
    console.log('Incoming Request: ', req.form);

    let response = welcome();

    resp.set({'Content-Type': 'text/xml'});

    resp.write(response);
    resp.status(200).send();
});

app.use('/', (err, req, resp, next) => {
    console.log('Incoming Request Failed to Route: ', req.path, err);

})



module.exports = {
    app: app,
    start: function (port) {
        app.listen(port);
    }
};

