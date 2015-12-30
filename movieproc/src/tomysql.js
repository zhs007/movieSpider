"use strict";

var util = require('util');
var sqlite3 = require('sqlite3').verbose();
var dbmgr = require('../lib/dbmgr');

function validStr(str) {
    while (str.indexOf("'") >= 0) {
        str = str.replace("'", "^");
    }

    return str;
}

function getString(str) {
    if (str == null) {
        return 'NULL';
    }

    return util.format("'%s'", validStr(str));
}

function getInt(i) {
    if (i == NaN || i == null) {
        return 'NULL';
    }

    return util.format('%d', i);
}

function getMaxCili006ID(callback) {
    let movie = dbmgr.getDBClient('movie');
    let sql = "select * from cili006 order by id desc limit 0, 1";
    movie.query(sql, function (err, rows, fields) {
        if (err) {
            callback(0);

            return ;
        }

        if (movie.isValidResult(rows, 'id')) {
            callback(rows[0].id);
        }
        else {
            callback(0);
        }
    });
}

function getMaxID_dytt(callback) {
    let movie = dbmgr.getDBClient('movie');
    let sql = "select * from dytt8 order by id desc limit 0, 1";
    movie.query(sql, function (err, rows, fields) {
        if (err) {
            callback(0);

            return ;
        }

        if (movie.isValidResult(rows, 'id')) {
            //callback(0);
            callback(rows[0].id);
        }
        else {
            callback(0);
        }
    });
}

function getMaxID_commonfile(callback) {
    let movie = dbmgr.getDBClient('movie');
    let sql = "select * from commonfile order by id desc limit 0, 1";
    movie.query(sql, function (err, rows, fields) {
        if (err) {
            callback(0);

            return ;
        }

        if (movie.isValidResult(rows, 'id')) {
            //callback(0);
            callback(rows[0].id);
        }
        else {
            callback(0);
        }
    });
}

function procCommonFile(db, callback) {
    getMaxID_commonfile(function (maxid) {
        let sql = util.format("select * from commonfile where `index` >= %d and url like 'ed2k%' order by `index` asc", maxid);
        db.all(sql, function (err, row) {
            if (err) {
                console.log(util.format('all sql(%s) err is %j', sql, JSON.stringify(err)));

                return ;
            }

            if (row) {
                let runsql = [];
                for (let i = 0; i < row.length; ++i) {
                    //console.log(util.format('row %d is %j', i, row[i]));
                    let cursql = util.format("insert into commonfile(id, `url`, `filename`) values(%d, %s, %s)",
                        row[i].index,
                        getString(row[i].url),
                        getString(row[i].name)
                    );
                    runsql.push(cursql);
                }

                let movie = dbmgr.getDBClient('movie');
                movie.queryList(runsql, function () {
                    callback();
                });
            }
        });
    });
}

function procDytt8(db, callback) {
    getMaxID_dytt(function (maxdyttid) {
        let sql = util.format("select * from dytt8 where id >= %d order by id asc", maxdyttid);
        db.all(sql, function (err, row) {
            if (err) {
                console.log(util.format('all sql(%s) err is %j', sql, JSON.stringify(err)));

                return ;
            }

            if (row) {
                let runsql = [];
                for (let i = 0; i < row.length; ++i) {
                    //console.log(util.format('row %d is %j', i, row[i]));
                    let cursql = util.format("insert into dytt8(`id`, `url`, `name`, `downurl`) values(%d, %s, %s, %s)",
                        row[i].id,
                        getString(row[i].url),
                        getString(row[i].name),
                        getString(row[i].downurl)
                    );
                    runsql.push(cursql);
                }

                let movie = dbmgr.getDBClient('movie');
                movie.queryList(runsql, function () {
                    callback();
                });
            }
        });
    });
}

function procCili006(db, callback) {
    getMaxCili006ID(function (maxcili006id) {
        let sql = util.format("select * from cili006 where id >= %d order by id asc", maxcili006id);
        db.all(sql, function (err, row) {
            if (err) {
                console.log(util.format('all sql(%s) err is %j', sql, JSON.stringify(err)));

                return ;
            }

            if (row) {
                let runsql = [];
                for (let i = 0; i < row.length; ++i) {
                    console.log(util.format('row %d is %j', i, row[i]));
                    let cursql = util.format("insert into cili006(`id`, `filename`, `magnet`, `ed2k`, `cname`, `engname`, `type`, `season`, `episode`, `movieid`) values(%d, %s, %s, %s, %s, %s, %s, %s, %s, %s)",
                        row[i].id,
                        getString(row[i].filename),
                        getString(row[i].magnet),
                        getString(row[i].ed2k),
                        getString(row[i].cname),
                        getString(row[i].engname),
                        getInt(row[i].type),
                        getInt(row[i].season),
                        getInt(row[i].episode),
                        getInt(row[i].movieid)
                    );
                    runsql.push(cursql);
                }

                let movie = dbmgr.getDBClient('movie');
                movie.queryList(runsql, function () {
                    callback();
                });
            }
        });
    });
}

function proc(next) {
    let db = new sqlite3.Database('../moviespider/movie.db', sqlite3.OPEN_READWRITE, function (err) {
        if (err) {
            if (err) {
                console.log(util.format('open db err is %j', err));

                return ;
            }
        }

        procCili006(db, function () {
            procDytt8(db, function () {
                procCommonFile(db, function () {
                    next();
                });
            });
        });
    });
}

exports.proc = proc;