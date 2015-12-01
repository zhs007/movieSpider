"use strict";

var util = require('util');
var async = require('async');
var moviemgr = require('../common/moviemgr');

function validStr(str) {
    //while (str.indexOf("'") >= 0) {
    str = str.replace(/\'/g, "''");
    //}

    return str;
}

// callback(changes)
function updMovieID(id, movieid, callback) {
    let sql = util.format("update cili006 set movieid = %d where id = ", movieid, id);
    moviemgr.singleton.run(sql, function (err) {
        if (err) {
            console.log(util.format('run sql(%s) err is %j', sql, JSON.stringify(err)));

            return ;
        }

        callback(this.changes);
    })
}

function proc(next) {
    let sql = "select * from cili006 where type = 1 and movieid = 0";
    moviemgr.singleton.all(sql, function (err, row) {
        if (err) {
            console.log(util.format('all sql(%s) err is %j', sql, JSON.stringify(err)));

            return ;
        }

        if (row) {
            async.eachSeries(row, function (curline, callback) {
                moviemgr.addMovie(curline.cname, curline.engname, curline.type, curline.season, function (movieid) {
                    updMovieID(curline.id, movieid, function (changes) {
                        callback();
                    });
                });
            }, function (err) {
                console.log('cili006ex ok!');

                next();
            });
        }
    });

}

exports.proc = proc;