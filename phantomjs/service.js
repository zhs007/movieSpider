/**
 * Created by zhs007 on 15/10/8.
 */

var server = require('webserver').create();
var system = require('system');
var fs = require('fs');

var port = 8088;
var maxtime = 10 * 1000;

var ServiceNode = {
    create: function (request, response) {
        var obj = {};

        obj.__proto__ = ServiceNode;

        obj.request = request;
        obj.response = response;

        obj.lasttime = (new Date()).getTime();
        obj.document = undefined;

        obj.page = new WebPage();

        obj.timerid = setInterval(function () {
            obj.onTimer();
        }, 1000);

        obj.doRequest(request.post.url);

        return obj;
    },

    doRequest: function (url) {
        var sn = this;

        sn.page.onResourceRequested = function(requestData, networkRequest) {
            console.log('Request (#' + requestData.id + '): ' + JSON.stringify(requestData));
            sn.onResponse();
        };

        sn.page.onResourceReceived = function(response) {
            console.log('Response (#' + response.id + ', stage "' + response.stage + '"): ' + JSON.stringify(response));
            sn.onResponse();
        };

        sn.page.onLoadStarted = function () {
            console.log('loading:' + url);
        };

        sn.page.onLoadFinished = function (status) {
            console.log('loaded:' + url + ' ' + status);

            if (status == 'success') {
            }

            sn.onResponse();
        };

        sn.page.open(url);
    },

    onResponse: function () {
        this.lasttime = (new Date()).getTime();
    },

    onTimer: function () {
        var curts = (new Date()).getTime();
        if (curts - this.lasttime > maxtime) {
            this.onEnd();
        }
    },

    onEnd: function () {
        var doc = this.page.evaluate(function () {
            return document;
        });

        this.document = JSON.stringify(doc);

        this.response.statusCode = 200;
        this.response.write(JSON.stringify(document));
        this.response.close();

        this.page.close();
        clearInterval(this.timerid);
    }
};

var service = server.listen(port, function(request, response) {

    if(request.method == 'POST' && request.post.url) {
        var sn = ServiceNode.create(request, response);

        //var url = request.post.url;

        //request_page(url, function(document){
        //    //response.statusCode = 200;
        //    //response.write(JSON.stringify(document));
        //    //response.close();
        //})

    } else {
        response.statusCode = 200;
        response.setHeader('Content-Type', 'text/html; charset=utf-8');
        response.write('error');
        response.close();
    }

});

if(service) {
    console.log("server started - http://localhost:" + server.port);
}

//function request_page(url, callback) {
//
//    var page = new WebPage();
//    //page.clipRect = { top: 0, left: 0, width: 700, height: 400 };
//    //page.viewportSize = { width: 700, height: 400 };
//
//    page.onLoadStarted = function () {
//        console.log('loading:' + url);
//    };
//
//    page.onLoadFinished = function (status) {
//        console.log('loaded:' + url + ' ' + status);
//
//        if (status == 'success') {
//            callback();
//        }
//
//        //var properties = {};
//        //
//        //properties.title = page.evaluate(function () {
//        //    return document.title
//        //});
//        //
//        //properties.links = page.evaluate(function () {
//        //    return Object.keys(
//        //        [].reduce.call(
//        //            document.querySelectorAll('a'),
//        //            function(memo, a){
//        //                if(a.protocol.indexOf('http') === 0) memo[a.href] = true;
//        //                return memo;
//        //            }
//        //            ,{})
//        //    )
//        //});
//        //
//        //properties.link_areas = page.evaluate(function () {
//        //    var sizes = [].reduce.call(document.querySelectorAll('a'), function(memo, a){
//        //        var bb = a.getBoundingClientRect(),
//        //            area = bb.width * bb.height,
//        //            href = a.getAttribute('href');
//        //
//        //        // update the map
//        //        if(area){
//        //            memo[href] = (memo[href] || 0) + area;
//        //        }
//        //
//        //        return memo;
//        //    },{});
//        //
//        //    return Object.keys(sizes).map(function(url){
//        //        return [url, sizes[url]];
//        //    });
//        //})
//        //
//        //setTimeout(function(){
//        //    var imageuri = 'data:image/png;base64,' + page.renderBase64('png');
//        //
//        //    callback(properties,imageuri);
//        //
//        //    page.close();
//        //},100)
//    };
//
//    page.open(url);
//}