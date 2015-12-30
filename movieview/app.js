var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var sessionmgr = require('./lib/sessionmgr');

var routes = require('./routes/index');
var users = require('./routes/users');
var cili006 = require('./routes/cili006');
var cili006ex = require('./routes/cili006ex');
var dytt8 = require('./routes/dytt8');
var search = require('./routes/search');
var commonfile = require('./routes/commonfile');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('rtherguh356945t2j'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(sessionmgr.funcMain);

app.use('/', routes);
app.use('/users', users);
app.use('/cili006', cili006);
app.use('/cili006ex', cili006ex);
app.use('/dytt8', dytt8);
app.use('/search', search);
app.use('/commonfile', commonfile);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
