"use strict";

var config = require('../config');
var moviesession = require('../base/moviesession');
var moviemgr = require('../base/moviemgr');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    if (moviesession.procSession(req, res)) {
        return ;
    }

    moviemgr.getCommonFile(function (lst) {
        res.render('commonfile', { lstmovie: lst });
    });
});

module.exports = router;
