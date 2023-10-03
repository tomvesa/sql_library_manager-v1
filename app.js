var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sequelize = require('./models/').sequelize;


var indexRouter = require('./routes/index');
const booksRouter = require('./routes/books')


//console.log(indexRouter)
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/books', booksRouter);
app.use('/', indexRouter);

(async() => {
  try{
    await sequelize.authenticate();
    console.log('conection to database successfull')
  }catch (error){
    console.error('Error connecting to database: ', error);
  }
})();

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));

});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  console.log("Error status: ", err.status);
  
  // Ensure you see this log
  console.log("Error handler middleware reached.");

//  res.locals.error = req.app.get('env') === 'development' ? err : {};
//   console.log("err status: ", err.status )
  // render the error page
  res.status(err.status || 500);

  if (err.status === 404) {
    res.render('page-not-found');
  } else {
    // Handle other errors differently or provide a generic error page
    res.render('error'); // You can create a separate 'error' template for this
  }
 
}
);

module.exports = app;
