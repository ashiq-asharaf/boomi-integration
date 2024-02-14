require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');




var app = express();

const db = require('./db');



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');  // Set the view engine to Pug


const headerName = process.env.HEADER_NAME || 'DefaultHeader';
const backgroundColor = process.env?.BACKGROUND_COLOR || '#f4f4f4';



app.use((req, res, next) => {
  res.locals.headerName = headerName;
  res.locals.backgroundColor = backgroundColor; // Pass backgroundColor to Pug template
  next();
});


// Middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', usersRouter);
// app.use('/users', usersRouter);

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
