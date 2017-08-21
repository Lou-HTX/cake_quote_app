var Product = require('../models/product');
var mongoose = require('mongoose');

mongoose.Promise = Promise;

mongoose.connect(process.env.MONGODB_URI || 'mongodb://test:Welcome01@ds155587.mlab.com:55587/heroku_25f351d9');
const db = mongoose.connection;
// mongodb://localhost/shopping


var products = [
    new Product({
        imagePath: '/images/unicorn.png',
        title: 'Unicorn Cake',
        description: 'Awesome Unicorn cake',
        price: 10
    }),
     new Product({
        imagePath: '/images/bb-8.png',
        title: 'BB-8 Cake',
        description: 'Awesome BB-8 cake',
        price: 10
    }),
     new Product({
        imagePath: '/images/batman_cake.png',
        title: 'Batman Cake',
        description: 'Awesome Batman cake',
        price: 10
    }),
];

var done = 0;
for (var i = 0; i < products.length; i++) {
    products[i].save(function(err, result) {
        done++;
        if (done === products.length) {
            exit();
        }
    });
    
}

function exit() {
    mongoose.disconnect();
}