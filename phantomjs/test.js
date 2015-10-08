/**
 * Created by zhs007 on 15/10/6.
 */

console.log('Hello, world!');

var page = require('webpage').create();
var fs = require('fs');
var maxtime = 10 * 1000;

var lastts = (new Date()).getTime();

setInterval(function() {
    var curts = (new Date()).getTime();
    if (curts - lastts > maxtime) {

        var doc = page.evaluate(function () {
            return document;
        });

        //console.log(JSON.stringify(doc));

        page.render('taobao.png');
        fs.write('taobao.json', JSON.stringify(doc), 'w');

        phantom.exit();
    }
}, 1000);

page.onResourceRequested = function(requestData, networkRequest) {
    console.log('Request (#' + requestData.id + '): ' + JSON.stringify(requestData));
    lastts = (new Date()).getTime();
};

page.onResourceReceived = function(response) {
    console.log('Response (#' + response.id + ', stage "' + response.stage + '"): ' + JSON.stringify(response));
    lastts = (new Date()).getTime();
};

page.open('http://h5.m.taobao.com/app/movie/pages/redeem/movie-list.html', function(status) {
    console.log("Status: " + status);
    if(status === "success") {
        //var doc = page.evaluate(function () {
        //    return document;
        //});

        //console.log(JSON.stringify(doc));

        //page.render('taobao.png');
    }
    //phantom.exit();
});