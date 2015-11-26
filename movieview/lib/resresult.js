"use strict";

var jadecache = require('jadecache');

const RESULTTYPE_NONE       = 0;
const RESULTTYPE_URL        = 1;
const RESULTTYPE_JADE       = 2;
const RESULTTYPE_JSON       = 3;

class ResponseResult {

    constructor() {
        this.restype = RESULTTYPE_NONE;

        this.url = '';
        this.jsonobj = {};
        this.jadefile = '';
        this.param = {};
    }

    redirect(url) {
        this.restype = RESULTTYPE_URL;
        this.url = url;
    }

    renderJade(jadefile) {
        this.restype = RESULTTYPE_JADE;
        this.jadefile = jadefile;
    }

    outputJsonObj(obj) {
        this.restype = RESULTTYPE_JSON;
        this.jsonobj = obj;
    }

    render(res) {
        if (this.restype == RESULTTYPE_NONE) {
            res.send('');
        }
        else if (this.restype == RESULTTYPE_URL) {
            res.redirect(this.url);
        }
        else if (this.restype == RESULTTYPE_JADE) {
            res.send(jadecache.render2str(this.jadefile, this.param));
        }
        else if (this.restype == RESULTTYPE_JSON) {
            res.send(JSON.stringify(this.jsonobj));
        }
        else {
            res.status(500);
            res.render('error', {
                message: 'Result type err ' + this.restype,
                error: 'err'
            });
        }
    }
};

exports.ResponseResult = ResponseResult;