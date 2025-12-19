const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('../config/db');

// Import all necessary models
const Service = require('../models/Service');
const Product = require('../models/Product');
const User = require('../models/User');

// Correctly configure the path to the .env file
dotenv.config({ path: __dirname + '/../.env' });

const importData = async () => {
    try {
        await connectDB();

        // Clear existing data
        await Service.deleteMany();
        await Product.deleteMany();
        console.log('Old data destroyed...');

        // Find an admin user to associate with the sample data
        const adminUser = await User.findOne({ isAdmin: true });
        if (!adminUser) {
            console.error('❌ CRITICAL: No admin user found in the database!');
            console.error('Please create an admin user first before running the seeder.');
            process.exit(1);
        }
        const adminUserId = adminUser._id;
        console.log(`✅ Admin user found: ${adminUser.name}`);

        // Sample services data
        const sampleServices = [
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
        ];
        
        // Sample products data
        const sampleProducts = [
            {
                name: 'Royal Canin Maxi Puppy Food 1kg',
                image: '/images/sample.jpg', // We will add these images later
                brand: 'Royal Canin',
                category: 'Food',
                description: 'Complete feed for dogs - For large breed puppies.',
                price: 4500,
                countInStock: 25,
                user: adminUserId // Use the admin user's ID
            },
            {
                name: 'Catnip Mouse Toy',
                image: '/images/sample.jpg',
                brand: 'CatComfort',
                category: 'Toys',
                description: 'A fun and engaging mouse toy with premium catnip.',
                price: 850,
                countInStock: 50,
                user: adminUserId // Use the admin user's ID
            }
        ];

        // Insert new data
        await Service.insertMany(sampleServices);
        await Product.insertMany(sampleProducts);

        console.log('✅ All sample data imported successfully!');
        process.exit();

    } catch (error) {
        console.error("❌ Error with data import:");
        console.error(error);
        process.exit(1);
    }
};

importData();