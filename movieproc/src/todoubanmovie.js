"use strict";

var util = require('util');
var async = require('async');
var moviemgr = require('../common/moviemgr');

function findDoubanMovie(doubanid, callback) {
    let sql = util.format("select * from doubanmovie where dbid = %s", doubanid.toString());
    moviemgr.singleton.all(sql, function (err, rows) {
        if (err) {
            console.log(util.format('all sql(%s) err is %j', sql, JSON.stringify(err)));

            return ;
        }

        if (rows && rows.length > 0) {
            callback(rows[0].dbid);

            return ;
        }

        callback(0);
    });
}

// callback(id)
function add2DoubanMovie(doubanid, callback) {
    findDoubanMovie(doubanid, function (id) {
        if (id > 0) {
            callback(id);
        }
        else {
            let sql = util.format("insert into doubanmovie(dbid) values(%s)", doubanid.toString());
            moviemgr.singleton.run(sql, function (err) {
                if (err) {
                    console.log(util.format('run sql(%s) err is %j', sql, JSON.stringify(err)));

                    return ;
                }

                callback(this.lastID);
            });
        }
    });
}

function procDoubanSearch(next) {
    let sql = "select * from doubansearch where proc > 0";
    moviemgr.singleton.all(sql, function (err, row) {
        if (err) {
            console.log(util.format('all sql(%s) err is %j', sql, JSON.stringify(err)));

            return ;
        }

        if (row) {
            async.eachSeries(row, function (curline, callback) {
                add2DoubanMovie(curline.doubanid, function (id) {
                    callback();
                });
            }, function (err) {
                next();
            });
        }
    });
}

function proc(next) {
    procDoubanSearch(function () {
        console.log('procDoubanSearch ok!');
        next();
    });
}

exports.proc = proc;