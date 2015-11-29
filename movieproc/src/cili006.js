"use strict";

var util = require('util');
var async = require('async');
var moviemgr = require('../common/moviemgr');

var rSE = new RegExp('S[0-9][0-9]E[0-9][0-9]');
var rEp = new RegExp('Ep[0-9][0-9]');
var rCN = new RegExp('[\u4e00-\u9fa5]');

function isSE(str) {
    return rSE.exec(str);
}

function isEp(str) {
    return rEp.exec(str);
}

function hasCN(str) {
    return rCN.exec(str);
}

function validStr(str) {
    while (str.indexOf("'") >= 0) {
        str = str.replace("'", "^");
    }

    return str;
}

function procline(db, line) {
    if (isSE(line.filename)) {
        let arr = line.filename.split('.');
        let cname = '';
        let engname = '';
        let ii = 0;

        for (; ii < arr.length; ++ii) {
            if (!hasCN(arr[ii])) {
                break ;
            }

            if (ii > 0) {
                cname += '.';
            }

            cname += arr[ii];
        }

        let bii = ii;
        for (; ii < arr.length; ++ii) {
            if (isSE(arr[ii])) {
                break ;
            }

            if (ii > bii) {
                engname += ' ';
            }

            engname += arr[ii];
        }

        let s = parseInt(arr[ii].slice(1, 3));
        let e = parseInt(arr[ii].slice(4));

        let sql = util.format("update cili006 set cname = '%s', engname = '%s', season = %d, episode = %d, type = 1 where id = %d",
            validStr(cname), validStr(engname), s, e, line.id);

        //db.run(sql);

        return sql;
    }

    return undefined;
}

function procName() {

}

function proc(next) {
    let sql = "select * from cili006 where type = 0 order by id asc";
    moviemgr.singleton.all(sql, function (err, row) {
        if (err) {
            console.log(util.format('all sql(%s) err is %j', sql, JSON.stringify(err)));

            return ;
        }

        if (row) {
            let runsql = [];
            for (let i = 0; i < row.length; ++i) {
                console.log(util.format('row %d is %j', i, row[i]));
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
                next();
            });
        }
    });
}

exports.proc = proc;