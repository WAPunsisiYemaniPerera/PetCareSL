const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Pet = require('../models/Pet');
const Order = require('../models/Order');
const { protect, admin } = require('../middleware/authMiddleware'); // Middleware import is needed


// GET /api/admin/stats
router.get('/stats', protect, admin, async (req, res) => {
    try {
        const userCount = await User.countDocuments({});
        const petCount = await Pet.countDocuments({});
        const adoptionCount = await Pet.countDocuments({ status: 'For Adoption' });
        
        const orderCount = await Order.countDocuments({});

        res.json({ 
            users: userCount, 
            pets: petCount, 
            forAdoption: adoptionCount, 
            orders: orderCount 
        });
        
    } catch (error) {
        console.error(error); 
        res.status(500).json({ message: "Server Error" });
    }
});

// GET /api/admin/users
router.get('/users', protect, admin, async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// DELETE /api/admin/users/:id
router.delete('/users/:id', protect, admin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            // Prevent deleting an admin account
            if(user.isAdmin) {
                return res.status(400).json({ message: 'Cannot delete admin user' });
            }
            await User.deleteOne({ _id: user._id });
            res.json({ message: 'User removed' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// POST /api/admin/pets
router.post('/pets', protect, admin, async (req, res) => {
    try {
        const { name, petType, breed, age, story, shelterInfo, image, contact, status } = req.body;

        const pet = new Pet({
            name: name || 'Sample Name',
            petType: petType || 'Dog',
            breed: breed || 'Sample Breed',
            age: age || 1,
            status: status || 'For Adoption',
            story: story || 'Sample story...',
            shelterInfo: shelterInfo || 'Located at...',
            image: image || '/images/sample.jpg',
            contact: contact || '0123456789',
            user: req.user._id,
        });

        const createdPet = await pet.save();
        res.status(201).json(createdPet);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// GET /api/admin/pets
router.get('/pets', protect, admin, async (req, res) => {
    try {
        const pets = await Pet.find({});
        res.json(pets);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// GET /api/admin/pets/:id
router.get('/pets/:id', protect, admin, async (req, res) => {
    try {
        const pet = await Pet.findById(req.params.id);
        if (pet) {
            res.json(pet);
        } else {
            res.status(404).json({ message: 'Pet not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// PUT /api/admin/pets/:id
router.put('/pets/:id', protect, admin, async (req, res) => {
    // **FIX:** Get variables from req.body first
    const { name, petType, breed, age, status, story, shelterInfo, image, contact } = req.body;
    try {
        const pet = await Pet.findById(req.params.id);
        if (pet) {
            pet.name = name;
            pet.petType = petType;
            pet.breed = breed;
            pet.age = age;
            pet.status = status;
            pet.story = story;
            pet.shelterInfo = shelterInfo;
            pet.image = image;
            pet.contact = contact;

            const updatedPet = await pet.save();
            res.json(updatedPet);
        } else {
            res.status(404).json({ message: 'Pet not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// DELETE /api/admin/pets/:id
router.delete('/pets/:id', protect, admin, async (req, res) => {
    try {
        const pet = await Pet.findById(req.params.id);
        if (pet) {
            await Pet.deleteOne({ _id: pet._id });
            res.json({ message: 'Pet removed' });
        } else {
            res.status(404).json({ message: 'Pet not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;