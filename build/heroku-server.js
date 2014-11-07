'use strict';
var express  = require('express'),
    settings = require('./heroku-settings');

var app            = express();
var basicAuth      = require('basic-auth');

var auth = function (req, res, next) {
    function unauthorized(res) {
        res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
        return res.sendStatus(401);
    }

    var user = basicAuth(req);

    if (!user || !user.name || !user.pass) {
        return unauthorized(res);
    }

    if (user.name === settings.username && user.pass === settings.password) {
        return next();
    } else {
        return unauthorized(res);
    }
};

app.use(auth);
app.use(express.static('dist'));
app.listen(process.env.PORT || 3000);
