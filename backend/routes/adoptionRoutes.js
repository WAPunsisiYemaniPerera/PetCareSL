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

//changing the status
router.put('/:id', protect, admin, async(req,res)=>{
    const { status } = req.body;

    try{
        const request = await AdoptionRequest.findById(req.params.id);

        if(request){
            request.status = status; //update the status
            const updatedRequest = await request.save();
            
            //if approved, change the status of the pet
            if (status === 'Approved'){
                const Pet = require('../models/Pet'); //call the pet model
                const pet = await Pet.findById(request.pet);

                if(pet){
                    pet.status = 'Adopted';
                    await pet.save();
                }
            }

            res.json(updatedRequest);
            
        } else{
            res.status(404).json({
                message: 'Request not found'
            });
        }
    } catch (error){
        res.status(500).json({
            message:'Server Error'
        })
    }
})

//get the details of logged persons
router.get('/my-requests', protect, async(req,res)=>{
    try{
        const requests = await AdoptionRequest.find({
            user: req.user._id
        })
            .populate('pet', 'name image');
        res.jason(requests);

    } catch (error){
        res.status(500).json({
            message: 'Server Error'
        })
    }
})

module.exports = router;