"use strict";

var Session = require('../lib/sessionmgr').Session;

class MovieSession extends Session {

    constructor() {
        super();

        //this.admininfo = undefined;
    }
};

function procSession(req, res) {
    let session = req.session;

    //if (session.admininfo == undefined) {
    //    if (req.originalUrl != '/login') {
    //        res.redirect('/login');
    //
    //        return true;
    //    }
    //}
    //else {
    //    if (req.originalUrl != '/main') {
    //        res.redirect('/main');
    //
    //        return true;
    //    }
    //}

    return false;
}

exports.MovieSession = MovieSession;

exports.procSession = procSession;