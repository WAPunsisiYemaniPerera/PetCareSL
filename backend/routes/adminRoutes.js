const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Pet = require('../models/Pet');

//giving the stats for the dashboard
router.get('/stats', async(req,res)=>{
    try{
        const userCount = await User.countDocuments({});
        const petCount = await Pet.countDocuments({});
        const adoptionCount = await Pet.countDocuments({ status: 'For Adoption'});
        const ownedCount = await Pet.countDocuments({ status: 'Owned'});

        res.json({
            users: userCount,
            pets: petCount,
            forAdoption: adoptionCount,
            ownedPets: ownedCount,
        });
    } catch (error){
        res.status(500).json({
            message: 'Server Error'
        })
    }
})

module.exports = router;