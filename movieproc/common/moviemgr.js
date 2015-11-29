"use strict";

var util = require('util');
var async = require('async');
var sqlite3 = require('sqlite3').verbose();

var singleton = undefined;

function validStr(str) {
    while (str.indexOf("'") >= 0) {
        str = str.replace("'", "^");
    }

    return str;
}

// callback(isok)
function init(callback) {
    singleton = new sqlite3.Database('../moviespider/movie.db', sqlite3.OPEN_READWRITE, function (err) {
        if (err) {
            callback(false);

            return ;
        }

        exports.singleton = singleton;

        callback(true);
    });
}

// callback(movieid)
function findMovie(cname, ename, type, season, callback) {
    let sql = util.format("select * from movieinfo where cname = '%s' and ename = '%s' and type = %d and season = %d", validStr(cname), validStr(ename), type, season);
    singleton.all(sql, function (err, row) {
        if (err) {
            console.log(util.format('all sql(%s) err is %j', sql, JSON.stringify(err)));

            callback(0);

            return ;
        }

        if (row && row.length > 0) {
            callback(row[0].id);

            return ;
        }

        callback(0);
    });
}

// callback(movieid)
function addMovie(cname, ename, type, season, callback) {
    findMovie(cname, ename, type, season, function (movieid) {
        if (movieid > 0) {
            callback(movieid);
        }
        else {
            let sql = util.format("insert into movieinfo(cname, ename, type, season) values('%s', '%s', %d, %d)", validStr(cname), validStr(ename), type, season);
            singleton.run(sql, function (err) {
                if (err) {
                    console.log(util.format('run sql(%s) err is %j', sql, JSON.stringify(err)));

                    return ;
                }

                callback(this.lastID);
            });
        }
    });
}

exports.singleton = singleton;

exports.init = init;
exports.addMovie = addMovie;