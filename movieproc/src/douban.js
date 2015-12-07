"use strict";

var util = require('util');
var async = require('async');
var moviemgr = require('../common/moviemgr');

var rCN = new RegExp('[\u4e00-\u9fa5]');

function hasCN(str) {
    return rCN.exec(str);
}

function validStr(str) {
    str = str.replace(/\'/g, "''");

    return str;
}

function getANumber(cc) {
    let arr = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
    for (let jj = 0; jj < arr.length; ++jj) {
        if (arr[jj] == cc) {
            return jj + 1;
        }
    }

    return -1;
}

function getNumber(str) {
    let nums = 0;
    let arr = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
    if (str.length == 3) {
        if (str.charAt(1) != '十') {
            return -1;
        }
        let c0 = getANumber(str.charAt(0));
        let c1 = getANumber(str.charAt(2));
        if (c0 == -1 || c1 == -1) {
            return -1;
        }

        return c0 * 10 + c1;
    }
    else if (str.length == 2) {
        if (str.charAt(0) == '十') {
            let c0 = getANumber(str.charAt(1));
            if (c0 == -1) {
                return -1;
            }

            return 10 + c0;
        }
        else if (str.charAt(1) == '十') {
            let c0 = getANumber(str.charAt(0));
            if (c0 == -1) {
                return -1;
            }

            return 10 * c0;
        }

        return -1;
    }
    else if (str.length == 1) {
        let c0 = getANumber(str.charAt(0));
        if (c0 == -1) {
            return -1;
        }

        return c0;
    }

    return -1;
}

function getSeason(str) {
    if (str.charAt(0) == '第' && str.charAt(str.length - 1) == '季') {
        return getNumber(str.slice(1, str.length - 1));
    }

    return -1;
}

function procline(db, line) {
    let name = line.cname.replace(/\(豆瓣\)/g, '');
    name = name.trim();
    let arr = name.split(/\s+/g);
    if (arr.length == 1) {
        let sql = util.format("update doubanmovie set name = '%s', proc = 2 where dbid = %d",
            validStr(name), line.dbid);

        return sql;
    }
    else if (arr.length == 2) {
        name = arr[0];
        let season = getSeason(arr[1]);
        if (season > 0) {
            let sql = util.format("update doubanmovie set name = '%s', season = %d, proc = 2 where dbid = %d",
                validStr(name), season, line.dbid);

            return sql;
        }
    }

    return undefined;
}

function procDouban(next) {
    let sql = "select * from doubanmovie where proc = 1 order by dbid asc";
    moviemgr.singleton.all(sql, function (err, row) {
        if (err) {
            console.log(util.format('all sql(%s) err is %j', sql, JSON.stringify(err)));

            return ;
        }

        if (row) {
            let runsql = [];
            for (let i = 0; i < row.length; ++i) {
                //console.log(util.format('row %d is %j', i, row[i]));
                let cursql = procline(moviemgr.singleton, row[i]);
                if (cursql != undefined) {
                    runsql.push(cursql);
                }
            }

            async.eachSeries(runsql, function (cursql, callback) {
                moviemgr.singleton.run(cursql, function () {
                    callback();
                });

            }, function (err) {
                console.log('doubanmovie ok!');

                next();
            });
        }
    });
}

function proclineName(line) {
    let name = line.name.replace(/\(豆瓣\)/g, '');
    name = name.trim();
    let arr = name.split(/\s+/g);
    if (arr.length == 1) {
        let sql = util.format("update doubanmoviename set rname = '%s', proc = 2 where id = %d",
            validStr(name), line.id);

        return sql;
    }
    else if (arr.length == 2) {
        name = arr[0];
        let season = getSeason(arr[1]);
        if (season > 0) {
            let sql = util.format("update doubanmoviename set rname = '%s', proc = 2 where id = %d",
                validStr(name), line.id);

            return sql;
        }
    }

    return undefined;
}

function procDoubanName(next) {
    let sql = "select * from doubanmoviename where proc = 0 order by id asc";
    moviemgr.singleton.all(sql, function (err, row) {
        if (err) {
            console.log(util.format('all sql(%s) err is %j', sql, JSON.stringify(err)));

            return ;
        }

        if (row) {
            let runsql = [];
            for (let i = 0; i < row.length; ++i) {
                //console.log(util.format('row %d is %j', i, row[i]));
                let cursql = proclineName(row[i]);
                if (cursql != undefined) {
                    runsql.push(cursql);
                }
            }

            async.eachSeries(runsql, function (cursql, callback) {
                moviemgr.singleton.run(cursql, function () {
                    callback();
                });

            }, function (err) {
                console.log('doubanmoviename ok!');

                next();
            });
        }
    });
}

function proc(next) {
    procDouban(function () {
        procDoubanName(function () {
            next();
        });
    });
}

exports.proc = proc;