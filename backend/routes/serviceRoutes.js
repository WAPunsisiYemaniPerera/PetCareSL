const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const mongoose = require('mongoose'); // Mongoose මෙතනට import කරගැනීම

// GET /api/services (සම්පූර්ණ ලැයිස්තුව ලබාගැනීම)
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

module.exports = router;