"use strict";

var util = require('util');

var wordarr = 'abcdefghijklmnopqrstuvwxyz0123456789';

var MAX_TIME = 20 * 60 * 1000;

class Session{
    constructor() {
        this.lastts = Date.now();
    }

    save() {

    }
};

var cursession = Session;

class SessionMgr{

    constructor() {
        this.mapSession = {};

        let smgr = this;
        setInterval(function () {
            let ts = Date.now();
            for (let sid in smgr.mapSession) {
                if (ts - smgr.mapSession[sid].lastts > MAX_TIME) {
                    smgr.mapSession[sid] = undefined;
                }
            }
        }, 1000 * 60);
    }

    makeSessionID() {
        let sid = '';
        let max = wordarr.length;

        for (let i = 0; i < 32; ++i) {
            let c = Math.floor(Math.random() * max);

            sid += wordarr.slice(c, c + 1);
        }

        return sid;
    }

    makeValidSessionID() {
        let sid = this.makeSessionID();
        if (this.mapSession.hasOwnProperty(sid)) {
            return this.makeValidSessionID();
        }

        return sid;
    }

    procCookie(req, res) {
        if (req.signedCookies.sessionid) {
            req.sessionid = req.signedCookies.sessionid;
        }
        else {
            req.sessionid = this.makeValidSessionID();
        }

        if (!this.mapSession.hasOwnProperty(req.sessionid)) {
            this.mapSession[req.sessionid] = new cursession();
        }
        else {
            this.mapSession[req.sessionid].lastts = Date.now();
        }

        res.cookie('sessionid', req.sessionid, {signed: true});

        req.session = this.mapSession[req.sessionid];
    }
}

var singleton = new SessionMgr();

function setSessionType(st) {
    cursession = st;
}

function funcMain(req, res, next) {
    singleton.procCookie(req, res);

    next();

    req.session.save();
}

exports.singleton = singleton;

exports.Session = Session;

exports.setSessionType = setSessionType;
exports.funcMain = funcMain;