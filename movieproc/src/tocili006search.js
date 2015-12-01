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

function getExName(name, season) {
    let s = '';
    if (season >= 10) {
        s = 'S' + season;
    }
    else {
        s = 'S0' + season;
    }

    let begin = name.indexOf(s);

    return name.slice(0, begin);
}

function procCili006SearchType2(next) {
    let sql = "select * from cili006search where proc = 2";
    moviemgr.singleton.all(sql, function (err, row) {
        if (err) {
            console.log(util.format('all sql(%s) err is %j', sql, JSON.stringify(err)));

            return ;
        }

        if (row) {
            async.eachSeries(row, function (curline, callback) {

                let curname = curline.cname + 'E0';
                add2Search(curname, function (id) {
                    callback();
                });

            }, function (err) {
                next();
            });
        }
    });
}

function procCili006(next) {
    let sql = "select * from cili006";
    moviemgr.singleton.all(sql, function (err, row) {
        if (err) {
            console.log(util.format('all sql(%s) err is %j', sql, JSON.stringify(err)));

            return ;
        }

        if (row) {
            let lstname = [];
            async.eachSeries(row, function (curline, callback) {
                if (curline.type == 1) {
                    lstname.push(curline.cname);
                    let ccn = validStr(getExName(curline.filename, curline.season));
                    for (let ii = 1; ii <= curline.season; ++ii) {
                        let s = '';
                        if (ii >= 10) {
                            s = 'S' + ii;
                        }
                        else {
                            s = 'S0' + ii;
                        }

                        lstname.push(ccn + s);
                    }
                }

                callback();
            }, function (err) {
                async.eachSeries(lstname, function (curname, callback) {
                    add2Search(curname, function (id) {
                        callback();
                    });
                }, function (err) {
                    next();
                })
            });
        }
    });
}

function proc(next) {
    procCili006(function () {
        console.log('cili006search cili006 ok!');
        procCili006SearchType2(function () {
            console.log('cili006search type2 ok!');
            next();
        });
    });
}

exports.proc = proc;