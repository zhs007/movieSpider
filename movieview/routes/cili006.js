"use strict";

var config = require('../config');
var moviesession = require('../base/moviesession');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    if (moviesession.procSession(req, res)) {
        return ;
    }

    res.render('cili006', { title: config.appname });
});

module.exports = router;
