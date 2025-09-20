const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const mongoose = require('mongoose'); 

// GET /api/services 
router.get('/', async (req, res) => {
    try {
        const services = await Service.find({});
        res.json(services);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

router.get('/:id', async (req, res) => {
    // verify that the object id is valid
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(404).json({ message: 'Invalid ID format.' });
    }
    
    try {
        const service = await Service.findById(req.params.id);

        if (service) {
            res.json(service);
        } else {
            res.status(404).json({ message: 'Service not found' });
        }
    } catch (error) {
        console.error("--- ❌ ERROR within /api/services/:id route ---");
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// adding reviews
router.post('/:id/reviews', async (req, res) => {
    // taking the ratings and comments from the frontend
    const { rating, comment } = req.body;
    const serviceId = req.params.id;

    try {
        const service = await Service.findById(serviceId);

        if (service) {
            // create new review object
            // till we create user accounts, we get the name as 'Sample User'
            const review = {
                name: req.user.name,
                rating: Number(rating),
                comment,
                user: req.user._id,
            };

            // adding new review to the existing review list of the service
            service.reviews.push(review);

            // save the changes in the database
            await service.save();

            res.status(201).json({
                message: 'Review added successfully',
            });

        } else {
            res.status(404).json({
                message: 'Service not found',
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Server Error',
        });
    }
});

module.exports = router;
