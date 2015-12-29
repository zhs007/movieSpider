"use strict";

var dbmgr = require('./../lib/dbmgr');
var util = require('util');

class Cili006Info{

    constructor() {
        this.id = 0;
        this.filename = '';
        this.magnet = '';
        this.ed2k = '';
        this.cname = '';
        this.engname = '';
        this.type = 0;
        this.season = 0;
        this.episode = 0;
        this.movieid = 0;
    }
};

var lstCili006 = [];

// callback(lst)
function getCili006(callback) {
    lstCili006 = [];
    let movie = dbmgr.getDBClient('movie');
    let sql = util.format("select * from cili006 where type = 1 order by id desc limit 0, 100");
    movie.query(sql, function (err, rows, fields) {
        if (err) {
            callback(undefined);

            return ;
        }

        if (movie.isValidResult(rows, 'id')) {
            for (let ii = 0; ii < rows.length; ++ii) {
                let cm = new Cili006Info();

                cm.id = rows[ii].id;
                cm.filename = rows[ii].filename.replace('[MAG磁力下载站]', '');
                cm.magnet = rows[ii].magnet;
                cm.ed2k = rows[ii].ed2k;
                cm.cname = rows[ii].cname;
                cm.engname = rows[ii].engname;
                cm.type = rows[ii].type;
                cm.season = rows[ii].season;
                cm.episode = rows[ii].episode;
                cm.movieid = rows[ii].movieid;

                cm.base64url = (new Buffer(cm.ed2k)).toString('base64');

                lstCili006.push(cm);
            }

            callback(lstCili006);

            return ;
        }

        callback(undefined);

        return ;
    });
}

// callback(lst)
function getCili006Ex(name, callback) {
    lstCili006 = [];
    let movie = dbmgr.getDBClient('movie');
    let sql = util.format("select * from cili006 where type = 1 and cname like '%s' order by id desc", '%' + movie.getSafeString(name) + '%');
    movie.query(sql, function (err, rows, fields) {
        if (err) {
            callback(undefined);

            return ;
        }

        if (movie.isValidResult(rows, 'id')) {
            for (let ii = 0; ii < rows.length; ++ii) {
                let cm = new Cili006Info();

                cm.id = rows[ii].id;
                cm.filename = rows[ii].filename.replace('[MAG磁力下载站]', '');
                cm.magnet = rows[ii].magnet;
                cm.ed2k = rows[ii].ed2k;
                cm.cname = rows[ii].cname;
                cm.engname = rows[ii].engname;
                cm.type = rows[ii].type;
                cm.season = rows[ii].season;
                cm.episode = rows[ii].episode;
                cm.movieid = rows[ii].movieid;

                cm.base64url = (new Buffer(cm.ed2k)).toString('base64');

                lstCili006.push(cm);
            }

            callback(lstCili006);

            return ;
        }

        callback(undefined);

        return ;
    });
}

// callback(lst)
function getDytt8(callback) {
    let lstdytt8 = [];
    let movie = dbmgr.getDBClient('movie');
    let sql = util.format("select * from dytt8 order by id desc limit 0, 100");
    movie.query(sql, function (err, rows, fields) {
        if (err) {
            callback(undefined);

            return ;
        }

        if (movie.isValidResult(rows, 'id')) {
            for (let ii = 0; ii < rows.length; ++ii) {
                let cm = {};

                cm.id = rows[ii].id;
                cm.name = rows[ii].name;
                cm.downurl = rows[ii].downurl;

                let uri = encodeURI(cm.downurl);
                cm.base64url = (new Buffer(uri)).toString('base64');

                lstdytt8.push(cm);
            }

            callback(lstdytt8);

            return ;
        }

        callback(undefined);

        return ;
    });
}

exports.getCili006 = getCili006;
exports.getCili006Ex = getCili006Ex;
exports.getDytt8 = getDytt8;