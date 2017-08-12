const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
var index = require('./routes/index');
var path = require('path');

const app = express();

const exphbs = require('express-handlebars');

const PORT = process.env.PORT || 3000;

mongoose.Promise = Promise;

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/shopping');
const db = mongoose.connection;

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static(__dirname + 'public'));


app.use('/', index);

// const routes = require('./routes');
// for (let route in routes) {
//     app.use(route, routes[route]);
// }

db.on('error', (error) => {
    console.log(error);
});

app.engine('.hbs', exphbs({defaultLayout: 'layout' , extname:'.hbs'}));
app.set('view engine', '.hbs');

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}!`);
});

