"use strict";

var async = require('async');
var cili006 = require('../lib/cili006');
var tomysql = require('../lib/tomysql');

var arr = [cili006, tomysql];

async.eachSeries(arr, function (mod, callback) {
    mod.proc(function () {
        callback();
    });
}, function (err) {

});
