const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const Service = require('../models/Service');

dotenv.config({
    path: './backend/.env'
});

//sample data
const sampleServices = [
    {
        name: 'Best Care Animal Hospital',
        type: 'Vet Clinic',
        address: '25, Galle Road, Dehiwala',
        phone: '0112738738'
    },
    {
        name: 'PetVet Clinic',
        type: 'Vet Clinic',
        address: '110, Havelock Road, Colombo 5',
        phone: '0112580580'
    },
    {
        name: 'Paws & Whiskers Grooming',
        type: 'Groomer',
        address: '42, Flower Road, Colombo 7',
        phone: '0777123456'
    },
    {
        name: 'The Pet Emporium',
        type: 'Pet Shop',
        address: 'Liberty Plaza, Colombo 3',
        phone: '0112345678'
    },
    {
        name: 'Canine & Feline Paradise',
        type: 'Boarding',
        address: 'Malabe, Sri Lanka',
        phone: '0712345678'
    }
];

const importData = async()=>{
    try{
        await connectDB();
        await Service.deleteMany(); //deleting all the old ones
        await Service.insertMany(sampleServices); //put new data

        console.log('Data Imported Successfully!');
        process.exit();
    } catch (error){
        console.error('Error with data import: ${error}');
        process.exit(1);
    }
};

importData();

