const mongoose = require('mongoose');

const connectDB = async ()=>{
    try{
        //connecting to the databse using the URI in the .env file
        const conn = await mongoose.connect(process.env.MONGO_URI); 
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        
    } catch (error){
        console.error('Error connecting to MongoDB: ${error.message}');
        console.error(error);
        process.exit(1); //if error comes, the server stops
    }
}

module.exports = connectDB;