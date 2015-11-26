"use strict";

class BaseCtrl{

    constructor(ctrlid) {
        this.ctrlid = ctrlid;
    }

    checkParams(res, params) {
        if (arguments.length > 2) {

            for (let i = 2; i < arguments.length; ++i) {
                if (!params.hasOwnProperty(arguments[i])) {
                    res.send(JSON.stringify({err: 'no param ' + arguments[i]}));

                    return false;
                }
            }
        }

        return true;
    }
}

class CtrlMgr{

    constructor() {
        this.mapCtrl = {};
    }

    addCtrl(ctrl) {
        if (!this.mapCtrl.hasOwnProperty(ctrl.ctrlid)) {
            this.mapCtrl[ctrl.ctrlid] = ctrl;
        }
    }

    onReq(req, res, session) {
        let params;

        if (req.method == 'POST') {
            params = req.body;
        }
        else if (req.method == 'GET') {
            params = req.query;
        }

        if (req.params.hasOwnProperty('ctrlid')) {
            params.ctrlid = req.params.ctrlid;

            if (this.mapCtrl.hasOwnProperty(params.ctrlid)) {
                this.mapCtrl[params.ctrlid].onProc(req, res, session, params);

                return ;
            }
        }

        res.send(JSON.stringify({err: 'no ctrl.'}));
    }
}

var singleton = new CtrlMgr();

exports.BaseCtrl = BaseCtrl;

exports.singleton = singleton;
