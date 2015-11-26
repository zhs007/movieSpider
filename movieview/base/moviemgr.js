"use strict";

var dbmgr = require('./../lib/dbmgr');
var util = require('util');

class Cili006Info{

    constructor() {
        this.pid = 0;
        this.name = '';
    }
};

var mapAdmin = {};

// callback(admininfo)
function login(name, password, callback) {
    let admininfo = new AdminInfo();
    let slots3 = dbmgr.getDBClient('slots3');
    let sql = util.format("select pid from playerinfo where playertype = 4 and name = '%s' and password = '%s'", name, password);
    slots3.query(sql, function (err, rows, fields) {
        if (err) {
            callback(undefined);

            return ;
        }

        if (slots3.isValidResult(rows, 'pid')) {
            admininfo.pid = rows[0].pid;
            admininfo.name = name;

            callback(admininfo);

            return ;
        }

        callback(undefined);

        return ;
    });
}

exports.login = login;