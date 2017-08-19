var express = require('express');
var router = express.Router();
var Cart = require('../models/cart');

var Product = require('../models/product');
var expressValidator = require('express-validator');
router.use(expressValidator());

// var csrfProtection = csrf();
// router.use(csrfProtection);

/* GET home page. */
router.get('/', function(req, res, next) {
    Product.find(function(err, docs) {
        var productChunks = [];
        var chunkSize = 3;
        for (var i = 0; i < docs.length; i += chunkSize) {
            productChunks.push(docs.slice(i, i + chunkSize));
        }
        res.render('shop/index', { title: 'Shopping Cart', products: productChunks });
    });
});

router.get('/add-to-cart/:id', function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    Product.findById(productId, function(err, product) {
        if (err) {
            return res.redirect('/');
        }
        cart.add(product, product.id);
        req.session.cart = cart;
        // console.log(req.session.cart);
        // console.log("<=================================================================>");
        // console.log(req.session.cart.items);
        // console.log("<=================================================================>");
        // console.log(req.session.cart.items.id);
        res.redirect('/');
    });
});



router.get('/shopping-cart', function(req, res, next) {
    if (!req.session.cart) {
        return res.render('shop/shopping-cart', { cartProducts: null });
    }
    var cart = new Cart(req.session.cart);
    console.log('this is the cart')
    console.log(cart);
    console.log("<=================================================================>");
    console.log("these are the items in the cart");
    console.log(cart.items);
    console.log("<=================================================================>");
    console.log("these are the items in the items in the cart");
    console.log(cart.items.items);
    console.log("<=================================================================>");
    console.log("<===== This is the id of the first item in the cart =====>");
    // console.log(cart.items.items.id);

    res.render('shop/shopping-cart', { cartProducts: cart.generateArray(), totalPrice: cart.totalPrice });
});



module.exports = router;