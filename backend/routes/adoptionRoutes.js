const express = require('express');
const router = express.Router();
const AdoptionRequest = require('../models/AdoptionRequest');
const Pet = require('../models/Pet'); 
const { protect, admin } = require('../middleware/authMiddleware');


// GET /api/adoption/my-requests
router.get('/my-requests', protect, async (req, res) => {
    try {
        // get the id from logged user
        const requests = await AdoptionRequest.find({ user: req.user._id })
            .populate('pet', 'name image'); 
        
        res.json(requests);
    } catch (error) {
        console.error("Error fetching my requests:", error);
        res.status(500).json({ message: 'Server Error' });
    }
});


// POST /api/adoption
router.post('/', protect, async (req, res) => {
    const { petId, contactNumber, message } = req.body;
    try {
        const request = new AdoptionRequest({
            user: req.user._id,
            pet: petId,
            contactNumber,
            message
        });
        const createdRequest = await request.save();
        res.status(201).json(createdRequest);
    } catch (error) {
        console.error("Error creating request:", error);
        res.status(500).json({ message: 'Server Error' });
    }
});


// GET /api/adoption (Admin Only)
router.get('/', protect, admin, async (req, res) => {
    try {
        const requests = await AdoptionRequest.find({})
            .populate('user', 'name email')
            .populate('pet', 'name image');
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});


// PUT /api/adoption/:id (Admin Only)
router.put('/:id', protect, admin, async (req, res) => {
    const { status } = req.body;

    try {
        const request = await AdoptionRequest.findById(req.params.id);

        if (request) {
            request.status = status;
            await request.save();

            
            if (status === 'Approved') {
                const pet = await Pet.findById(request.pet);
                if (pet) {
                    pet.status = 'Owned'; 
                    pet.user = request.user; 
                    await pet.save();
                }
            }

            res.json(request);
        } else {
            res.status(404).json({ message: 'Request not found' });
        }
    } catch (error) {
        console.error("Error updating status:", error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;