const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const mongoose = require('mongoose'); 
const { protect } = require('../middleware/authMiddleware');

// 1. GET ALL SERVICES (Public)
router.get('/', async (req, res) => {
    try {
        const services = await Service.find({});
        res.json(services);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// 2. GET SINGLE SERVICE BY ID (Public)
router.get('/:id', async (req, res) => {
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
        res.status(500).json({ message: "Server Error" });
    }
});

// 3. CREATE SERVICE (Admin Only - Protected)
router.post('/', protect, async (req, res) => {
    try {
        const service = new Service({
            name: 'Sample Service',
            type: 'Vet Clinic',
            address: 'Sample Address',
            phone: '0000000000',
            image: '/images/sample.jpg',
            description: 'Sample Description'
        });

        const createdService = await service.save();
        res.status(201).json(createdService);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// 4. UPDATE SERVICE (Admin Only - Protected)
router.put('/:id', protect, async (req, res) => {
    const { name, type, address, phone, image, description } = req.body;

    try {
        const service = await Service.findById(req.params.id);

        if (service) {
            service.name = name || service.name;
            service.type = type || service.type;
            service.address = address || service.address;
            service.phone = phone || service.phone;
            service.image = image || service.image;
            service.description = description || service.description;

            const updatedService = await service.save();
            res.json(updatedService);
        } else {
            res.status(404).json({ message: 'Service not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// 5. DELETE SERVICE (Admin Only - Protected)
router.delete('/:id', protect, async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);

        if (service) {
            await service.deleteOne();
            res.json({ message: 'Service removed' });
        } else {
            res.status(404).json({ message: 'Service not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// 6. ADD REVIEW (Private)
router.post('/:id/reviews', protect, async (req, res) => {
    const { rating, comment } = req.body;
    try {
        const service = await Service.findById(req.params.id);
        if (service) {
            const review = {
                name: req.user.name,
                rating: Number(rating),
                comment,
                user: req.user._id,
            };
            service.reviews.push(review);
            await service.save();
            res.status(201).json({ message: 'Review added successfully' });
        } else {
            res.status(404).json({ message: 'Service not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;