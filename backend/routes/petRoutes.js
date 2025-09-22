const express = require('express');
const router = express.Router();
const Pet = require('../models/Pet');
const { protect } = require('../middleware/authMiddleware');

router.get('/mypets', protect, async (req, res) => {
    try {
        const pets = await Pet.find({ user: req.user._id });
        res.json(pets);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

router.post('/', protect, async (req, res) => {
    const { name, petType, breed, age } = req.body;

    try {
        const pet = new Pet({
            name,
            petType,
            breed,
            age,
            user: req.user._id, 
        });

        const createdPet = await pet.save();
        res.status(201).json(createdPet);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

//for adopted pets
router.get('/adoption', async (req, res) => {
    try{
        const adoptionPets = await Pet.find({ status: 'For Adoption' });
        res.json(adoptionPets);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
})

module.exports = router;