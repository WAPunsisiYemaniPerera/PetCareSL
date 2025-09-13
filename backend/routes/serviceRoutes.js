const express = require('express');
const router = express.Router();
const Service = require('../models/Service');

//The gate that talks with frontend
// When request comes to this, it finds the services from db
router.get('/', async (req,res)=>{
    try{
        const services = await Service.find({}); //find all
        res.json(services);
    } catch (error){
        console.error(error);
        res.status(500).json({
            message: "Server Error"
        });
    }
});

module.exports = router;