const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateProduct } = require('../middleware');

const Product = require('../models/product');

router.get('/', catchAsync(async (req, res) => {
    const products = await Product.find({});
    res.render('products/index', { products })
}));

router.get('/new', isLoggedIn, (req, res) => {
    res.render('products/new');
})


router.post('/', isLoggedIn, validateProduct, catchAsync(async (req, res, next) => {
    const product = new Product(req.body.product);
    product.author = req.user._id;
    await product.save();
    req.flash('success', 'Successfully made a new product!');
    res.redirect(`/products/${product._id}`)
}))

router.get('/:id', catchAsync(async (req, res,) => {
    const product = await Product.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    console.log(product);
    if (!product) {
        req.flash('error', 'Cannot find that product!');
        return res.redirect('/products');
    }
    res.render('products/show', { product });
}));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id)
    if (!product) {
        req.flash('error', 'Cannot find that product!');
        return res.redirect('/products');
    }
    res.render('products/edit', { product });
}))

router.put('/:id', isLoggedIn, isAuthor, validateProduct, catchAsync(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, { ...req.body.product });
    req.flash('success', 'Successfully updated product!');
    res.redirect(`/products/${product._id}`)
}));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted product')
    res.redirect('/products');
}));

module.exports = router;