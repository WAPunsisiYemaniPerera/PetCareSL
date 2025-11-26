const express = require('express');
const router = express.Router();
const AdoptionRequest = require('../models/AdoptionRequest');
const { protect, admin } = require('../middleware/authMiddleware');


router.post('/', protect, async (req, res) => {
    console.log("📝 New Adoption Request incoming..."); // Log 1
    const { petId, contactNumber, message } = req.body;

    try {
        const request = new AdoptionRequest({
            user: req.user._id,
            pet: petId,
            contactNumber,
            message
        });
        const createdRequest = await request.save();
        console.log("✅ Request Saved Successfully!"); // Log 2
        res.status(201).json(createdRequest);
    } catch (error) {
        console.error("❌ Error saving adoption request:", error); // Error Log
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});


router.get('/', protect, admin, async (req, res) => {
    console.log("👀 Admin checking requests..."); // Log 3
    try {
        const requests = await AdoptionRequest.find({})
            .populate('user', 'name email')
            .populate('pet', 'name image');
        
        console.log(`✅ Found ${requests.length} requests`); // Log 4
        res.json(requests);
    } catch (error) {
        console.error("❌ Error fetching requests:", error); // Error Log
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

module.exports = router;