var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


// connection to the database
var mongoose = require("mongoose");
var mongoDB = "mongodb://127.0.0.1/vaja3_db";
mongoose.connect(mongoDB);
// mongoose is using global promise library
mongoose.Promise = global.Promise;
// get default connection
var db = mongoose.connection;

// database error handling
db.on("error", console.error.bind(console, "MongoDB connection error!"));

// including routes
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/userRoutes');
var questionsRouter = require('./routes/questionRoutes');
var answersRouter = require('./routes/answerRoutes');
var commentsRouter = require('./routes/commentRoutes');

var app = express();


// everything for using handlebars and handlebars helpers
var handlebars = require("handlebars");
var exphbs = require("express-handlebars");
var hbsHelpers = require("handlebars-helpers");
var multiHelpers = hbsHelpers();
var { allowInsecurePrototypeAccess } = require("@handlebars/allow-prototype-access");
var handleb = require("hbs");

const hbs = exphbs.create({
    helpers: multiHelpers,
    partialsDir: ["views/partials"],
    extname: ".hbs",
    layoutsDir: "views",
    defaultLayout: "layout",
    handlebars: allowInsecurePrototypeAccess(handlebars),

    // custom helpers
    /*helpers: {
      eq: function(arg1, arg2, options) {
        var next = arguments[arguments.length-1];
        return arg1 > arg2 ? next.fin() : next.inverse();
      }
    }*/
});

handleb.registerHelper('dateFormat', require('handlebars-dateformat'));

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
app.engine("hbs", hbs.engine);
app.set('view engine', 'hbs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// adding session
var session = require("express-session");
var MongoStore = require("connect-mongo");
const exp = require('constants');
app.use(session({
  secret: "sp_vaja3",
  resave: true,
  saveUninitialized: false,
  store: MongoStore.create({mongoUrl: mongoDB}) // storing session in database
}));

// saving session variables to locals
// so we can access them in all views
app.use(function(req, res, next) {
  res.locals.session = req.session;
  next();
});

app.use(function(req, res, next) {
  next();
});

// adding routers as middleware
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/questions', questionsRouter);
app.use('/answers', answersRouter);
app.use('/comments', commentsRouter);

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
