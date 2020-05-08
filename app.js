var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var mongo = require('./app/database');
var indexRouter = require('./routes/index');
var problemRouter = require('./routes/problemRouter');
var loggingRouter = require('./routes/loggingRouter');
var userRouter = require('./routes/userRouter');
var rankingRouter = require('./routes/ranking');

var QuestionCrawler  = require('./app/crawler/QuestionCrawler');
var UserCrawler = require('./app/crawler/UserCrawler');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'client/build')));

app.use('/api/v1/question', problemRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/log', loggingRouter);
app.use('/api/v1/ranking', rankingRouter);

app.use('*', (req, res, next) => {
  res.redirect('/');
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
