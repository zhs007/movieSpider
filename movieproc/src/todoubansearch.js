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

function findSearch(cname, nameex, callback) {
    let sql = util.format("select * from doubansearch where cname = '%s' and nameex = '%s'", cname, nameex);
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
function add2Search(cname, nameex, callback) {
    findSearch(cname, nameex, function (id) {
        if (id > 0) {
            callback(id);
        }
        else {
            let sql = util.format("insert into doubansearch(cname, proc, nameex) values('%s', 0, '%s')", cname, nameex);
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

function getCNumber(n) {
    let cn = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
    if (n >= 0 && n < cn.length) {
        return cn[n];
    }

    return '';
}

function getName(season) {
    if (season > 0) {
        if (season <= 10) {
            return '第' + getCNumber(season) + '季';
        }
        else if (season <= 100){
            let t = Math.floor(season / 10);
            let t0 = season - t * 10;

            if (t == 1) {
                return '第十' + getCNumber(t0) + '季';
            }
            else {
                return '第' + getCNumber(t) + '十' + getCNumber(t0) + '季';
            }
        }
    }
    return '';
}

function procCili006(next) {
    let sql = "select * from cili006";
    moviemgr.singleton.all(sql, function (err, row) {
        if (err) {
            console.log(util.format('all sql(%s) err is %j', sql, JSON.stringify(err)));

            return ;
        }

        if (row) {
            async.eachSeries(row, function (curline, callback) {
                if (curline.type == 1) {
                    let curname = validStr(curline.cname);
                    let curnameex = validStr(getName(curline.season));
                    add2Search(curname, curnameex, function (id) {
                        callback();
                    });
                } else {
                    callback();
                }
            }, function (err) {
                next();
            });
        }
    });
}

function proc(next) {
    procCili006(function () {
        console.log('doubansearch ok!');
        next();
    });
}

exports.proc = proc;