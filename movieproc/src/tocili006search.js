"use strict";

var util = require('util');
var async = require('async');
var moviemgr = require('../common/moviemgr');

function validStr(str) {
    while (str.indexOf("'") >= 0) {
        str = str.replace("'", "^");
    }

    return str;
}

function findSearch(cname, callback) {
    let sql = util.format("select * from cili006search where cname = '%s'", cname);
    moviemgr.singleton.all(sql, function (err, rows) {
        if (err) {
            console.log(util.format('all sql(%s) err is %j', sql, JSON.stringify(err)));

            return ;
        }

        if (rows && rows.length > 0) {
            callback(rows[0].id);

            return ;
        }

        callback(0);
    });
}

// callback(id)
function add2Search(cname, callback) {
    findSearch(cname, function (id) {
        if (id > 0) {
            callback(id);
        }
        else {
            let sql = util.format("insert into cili006search(cname, proc) values('%s', 0)", cname);
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

function proc(next) {
    let sql = "select * from movieinfo";
    moviemgr.singleton.all(sql, function (err, row) {
        if (err) {
            console.log(util.format('all sql(%s) err is %j', sql, JSON.stringify(err)));

            return ;
        }

        if (row) {
            async.eachSeries(row, function (curline, callback) {
                add2Search(curline.cname, function (id) {
                    callback();
                });

            }, function (err) {
                next();
            });
        }
    });

}

exports.proc = proc;