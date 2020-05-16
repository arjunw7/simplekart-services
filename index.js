"use strict";
let express = require('express')
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser')
let passport = require('passport');
let session = require('express-session');
let cors = require('cors')
let path = require('path');

let app = express()
console.log(new Date())

require('./models/models');
require('./passport')(passport);
let product = require('./routes/product');
let auth = require('./routes/authenticate')(passport);
let dev = require('./routes/dev');
let customers = require('./routes/customers')
let sellers = require('./routes/sellers')
let inquiries = require('./routes/inquiry')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

app.use(logger('dev'));
app.use(session({
    secret: 'covid-marketplace',
    saveUninitialized: true,
    resave: true
}));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(passport.session());

app.use('/product', product);
app.use('/auth', auth);
app.use('/dev', dev);
app.use('/customers',customers)
app.use('/sellers',sellers)
app.use('/inquiries', inquiries)
//Initialiaze passport


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
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

app.listen(5000, function() {
    console.log("Server started at port 5000")
})