const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
var index = require('./routes/index');
var user = require('./routes/user');
var path = require('path');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var validator = require('express-validator');
const MongoStore = require('connect-mongo')(session);
const app = express();
const exphbs = require('express-handlebars');
const PORT = process.env.PORT || 3000;
// ====================================================================================================
// 
// ====================================================================================================
mongoose.Promise = Promise;

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/shopping');
const db = mongoose.connection;
require('./config/passport');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(session({
    secret: 'mopedsarecool',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: { maxAge: 180 * 60 * 1000 }
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
// ====================================================================================================
// 
// ====================================================================================================
app.use(function(req, res, next) {
    res.locals.login = req.isAuthenticated();
    res.locals.session = req.session;
    next();
});
// ====================================================================================================
// 
// ====================================================================================================
app.use('/user', user);
app.use('/', index);
// ====================================================================================================
// 
// ====================================================================================================
db.on('error', (error) => {
    console.log(error);
});
// ====================================================================================================
// 
// ====================================================================================================
app.engine('.hbs', exphbs({ defaultLayout: 'layout', extname: '.hbs' }));
app.set('view engine', '.hbs');
// ====================================================================================================
// 
// ====================================================================================================
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}!`);
});