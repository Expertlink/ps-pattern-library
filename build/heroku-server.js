'use strict';
var express  = require('express'),
    settings = require('./build-settings');

var app            = express();
var basicAuth = require('basic-auth');

var auth = function (req, res, next) {
    function unauthorized(res) {
        res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
        return res.send(401);
    }

    var user = basicAuth(req);

    if (!user || !user.name || !user.pass) {
        return unauthorized(res);
    }

    if (user.name === settings.server.username && user.pass === settings.server.password) {
        return next();
    } else {
        return unauthorized(res);
    }
};

app.use(auth);
app.use(express.static(settings.paths.out));
app.listen(process.env.PORT || settings.server.port);
