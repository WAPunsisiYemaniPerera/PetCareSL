const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const Service = require('../models/Service');

dotenv.config({ path: '.env' });

// GeoJSON format: [longitude, latitude]
const servicesWithCoords = [
    { 
        name: 'Best Care Animal Hospital', 
        type: 'Vet Clinic', 
        address: '25, Galle Road, Dehiwala, Sri Lanka', 
        phone: '0112738738',
        location: { type: 'Point', coordinates: [79.8636, 6.8553] }
    },
    { 
        name: 'PetVet Clinic', 
        type: 'Vet Clinic', 
        address: '110, Havelock Road, Colombo 5, Sri Lanka', 
        phone: '0112580580',
        location: { type: 'Point', coordinates: [79.8614, 6.8883] }
    },
    { 
        name: 'Paws & Whiskers Grooming', 
        type: 'Groomer', 
        address: '42, Flower Road, Colombo 7, Sri Lanka', 
        phone: '0777123456',
        location: { type: 'Point', coordinates: [79.8601, 6.9142] }
    },
    { 
        name: 'The Pet Emporium', 
        type: 'Pet Shop', 
        address: 'Liberty Plaza, Colombo 3, Sri Lanka', 
        phone: '0112345678',
        location: { type: 'Point', coordinates: [79.8531, 6.9138] }
    },
    { 
        name: 'Canine & Feline Paradise', 
        type: 'Boarding', 
        address: 'Malabe, Sri Lanka', 
        phone: '0712345678',
        location: { type: 'Point', coordinates: [79.9554, 6.9038] }
    }
];

const importData = async () => {
    try {
        await connectDB();
        await Service.deleteMany(); // remove old data
        console.log('Old data destroyed...');
        
        await Service.insertMany(servicesWithCoords); 

        console.log(`\n✅ ${servicesWithCoords.length} services with coordinates were imported successfully!`);
        process.exit();
    } catch (error) {
        console.error("❌ Error with data import:");
        console.error(error);
        process.exit(1);
    }
};

importData();