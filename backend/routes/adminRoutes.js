const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Pet = require('../models/Pet');

// GET /api/admin/stats
router.get('/stats', async (req, res) => {
    try {
        const userCount = await User.countDocuments({});
        const petCount = await Pet.countDocuments({});
        const adoptionCount = await Pet.countDocuments({ status: 'For Adoption' });
        const ownedCount = await Pet.countDocuments({ status: 'Owned' });

        res.json({ users: userCount, pets: petCount, forAdoption: adoptionCount, ownedPets: ownedCount });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// GET /api/admin/users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// DELETE /api/admin/users/:id
router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            await User.deleteOne({ _id: user._id });
            res.json({ message: 'User removed' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

router.post('/pets', async (req,res)=>{
    try{
        const pet = new Pet ({
            name: "Buddy",
            petType: "Dog",
            breed: "Golden Retriever",
            age: 3,
            status: "For Adoption",
            story: "A friendly and energetic dog looking for a loving home.",
            shelterInfo: "Happy Tails Shelter, 1234 Pet Lane, Petville",
            image: 'https://example.com/images/buddy.jpg',
            user: req.user._id
        })
        const createdPet = await pet.save();
        res.status(201).json(createdPet);
    } catch (error){
        res.status(500).json({ message: 'Server Error' });
    }
})

//to see all the pets (owned and for adoption)
router.get('/pets', async(req,res)=>{
    try{
        const pets = await Pet.find({});
        res.json(pets);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
})

//delete a pet
router.delete('/pets/:id', async (req, res) => {
    try{
        const pet = await Pet.findById(req.params.id);
        if(pet){
            await Pet.deleteOne({_id: pet._id});
            res.json({ message: 'Pet removed' });
        } else {
            res.status(404).json({ message: 'Pet not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
})

module.exports = router;