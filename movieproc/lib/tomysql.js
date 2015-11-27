"use strict";

var util = require('util');
var sqlite3 = require('sqlite3').verbose();
var dbmgr = require('./dbmgr');
var config = require('../config');

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

function proc() {
    let db = new sqlite3.Database('../moviespider/movie.db', sqlite3.OPEN_READWRITE, function (err) {
        if (err) {
            if (err) {
                console.log(util.format('open db err is %j', err));

                return ;
            }
        }

        let sql = "select * from cili006 order by id desc";
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

                dbmgr.newDBClient('movie', config.db_host, config.db_user, config.db_pwd, config.db_name, function () {
                    let movie = dbmgr.getDBClient('movie');
                    movie.queryList(runsql, function () {

                    });
                });
            }
        });
    });
}

exports.proc = proc;