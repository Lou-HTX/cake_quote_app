var express = require('express');
var router = express.Router();
var Cart = require('../models/cart');
var Product = require('../models/product');
var Order = require('../models/order');
var expressValidator = require('express-validator');
router.use(expressValidator());

/* GET home page. */
router.get('/', function(req, res, next) {
    var successMsg = req.flash('success')[0];
    Product.find(function(err, docs) {
        var productChunks = [];
        var chunkSize = 3;
        for (var i = 0; i < docs.length; i += chunkSize) {
            productChunks.push(docs.slice(i, i + chunkSize));
        }
        res.render('shop/index', { title: 'Shopping Cart', products: productChunks, successMsg: successMsg, noMessages: !successMsg });
    });
});

// ====================================================================================================
// Routing for adding itmes to shopping cart.
// ====================================================================================================
router.get('/add-to-cart/:id', function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    Product.findById(productId, function(err, product) {
        if (err) {
            return res.redirect('/');
        }
        cart.add(product, product.id);
        req.session.cart = cart;
        res.redirect('/');
    });
});

// ====================================================================================================
// Routing for reducing quantity amounts from shopping cart. 
// ====================================================================================================
router.get('/reduce/:id', function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.reduceByOne(productId);
    req.session.cart = cart;
    res.redirect('/shopping-cart');
});

// ====================================================================================================
// Routing to remove an item from shopping cart.
// ====================================================================================================
router.get('/remove/:id', function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.removeItem(productId);
    req.session.cart = cart;
    res.redirect('/shopping-cart');
});

// ====================================================================================================
// Routing for getting items that were added to shopping cart and display in shopping cart view. 
// ====================================================================================================
router.get('/shopping-cart', function(req, res, next) {
    if (!req.session.cart) {
        return res.render('shop/shopping-cart', { cartProducts: null });
    }
    var cart = new Cart(req.session.cart);
    res.render('shop/shopping-cart', { cartProducts: cart.generateArray(), totalPrice: cart.totalPrice });
});

// ====================================================================================================
// Routing for shopping cart checkout once the checkou button is clicked in the shopping cart view.
// ====================================================================================================
router.get('/checkout', isLoggedIn, function(req, res, next) {
    if (!req.session.cart) {
        return res.redirect('/shopping-cart');
    }
    var cart = new Cart(req.session.cart);
    var errMsg = req.flash('error')[0];
    res.render('shop/checkout', { total: cart.totalPrice, errMsg: errMsg, noError: !errMsg });
});

// ====================================================================================================
// Routing for accepting credit card charges from the checkout view. 
// ====================================================================================================
router.post('/charge', isLoggedIn, function(req, res, next) {
    if (!req.session.cart) {
        return res.redirect('/shopping-cart');
    }
    var cart = new Cart(req.session.cart);

    var stripe = require("stripe")("sk_test_v86ihVaaNGft27qeGzF8r6JK");

    var token = req.body.stripeToken;

    var charge = stripe.charges.create({
        amount: cart.totalPrice * 100,
        currency: "usd",
        description: "Test charge",
        source: token,
    }, function(err, charge) {
        if (err) {
            req.flash('error', err.message);
            return res.redirect('/checkout');
        }
        var order = new Order({
            user: req.user,
            cart: cart,
            address: req.body.address,
            name: req.body.name,
            paymentId: charge.id
        });
        order.save(function(err, result) {
            req.flash('success', 'Successfully placed order!');
            req.session.cart = null;
            res.redirect('/');
        });
    });
});

module.exports = router;

// ====================================================================================================
// Function to check if a user is logged in.
// ====================================================================================================
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.session.oldUrl = req.url;
    res.redirect('/user/signin');
}