"use strict";

var dbmgr = require('../lib/dbmgr');
var config = require('../config');
var async = require('async');

var cili006 = require('../src/cili006');
var tomysql = require('../src/tomysql');

var arr = [cili006, tomysql];

dbmgr.newDBClient('movie', config.db_host, config.db_user, config.db_pwd, config.db_name, function () {
    async.eachSeries(arr, function (mod, callback) {
        mod.proc(function () {
            callback();
        });
    }, function (err) {
        console.log('OK!!!');
    });
});
