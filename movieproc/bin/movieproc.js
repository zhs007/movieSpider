"use strict";

var dbmgr = require('../lib/dbmgr');
var config = require('../config');
var async = require('async');

var moviemgr = require('../common/moviemgr');

var cili006 = require('../src/cili006');
var tomysql = require('../src/tomysql');
var cili006ex = require('../src/cili006ex');
var tocili006search = require('../src/tocili006search');
var todoubansearch = require('../src/todoubansearch');
var todoubanmovie = require('../src/todoubanmovie');
var douban = require('../src/douban');

var arr = [cili006, cili006ex, todoubanmovie, douban, tomysql];
//var arr = [douban];

moviemgr.init(function (isok) {
    dbmgr.newDBClient('movie', config.db_host, config.db_user, config.db_pwd, config.db_name, function () {
        async.eachSeries(arr, function (mod, callback) {
            mod.proc(function () {
                callback();
            });
        }, function (err) {
            console.log('OK!!!');
        });
    });
});
