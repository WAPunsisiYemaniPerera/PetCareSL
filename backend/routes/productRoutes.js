const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

//fetch all products(public)
router.get('/', async (req, res) => {
    try{
        const products = await Product.find({});
        res.json(products);
    } catch(error){
        res.status(500).json({message: 'Server Error'});
    }
})

//fetch single product by id(public)
router.get('/:id', async (req, res) => {
    try{
        const product = await Product.findById(req.params.id);
        if(product){
            res.json(product);
        } else {
            res.status(404).json({message: 'Product Not Found'});
        }
    } catch(error){
        res.status(500).json({message: 'Server Error'});
    }
})

module.exports = router;