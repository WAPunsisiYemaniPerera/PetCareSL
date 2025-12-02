const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protect,admin} = require('../middleware/authMiddleware');

//user order
router.post('/', protect, async(req,res)=>{
    const {orderItems, shippingAddress, totalPrice} = req.body;

    if(orderItems && orderItems.length ===0){
        res.status(400).json({
            message: 'No order Items'
        });
        return;
    } else{
        const order = new Order({
            user: req.user._id,
            orderItems,
            shippingAddress,
            totalPrice
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder)
    }
})

//see all the orders by admin
router.get('/', protect, admin, async(req,res)=>{
    try{
        const orders = await Order.find({}).populate('user', 'id name');
        res.json(orders);
    }catch(error){
        res.status(500).json({
            message:'Server Error'
        })
    }
});

module.exports = router;