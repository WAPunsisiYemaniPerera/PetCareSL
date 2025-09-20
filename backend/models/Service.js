const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    rating: { 
        type: Number, 
        required: true 
    },
    comment: { 
        type: String, 
        required: true 
    },
     user: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true, 
        ref: 'User' 
    },
}, {
    timestamps: true,
});

const serviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    type:{
        type:String,
        required: true,
        enum: ['Vet Clinic', 'Groomer', 'Pet Shop', 'Boarding'] //only one of them
    },
    address: {
        type : String,
        required : true
    },
    phone: {
        type: String,
        required : true
    },
    //for future map
    location: {
         type: { type: String, enum: ['Point'], default: 'Point' },
         coordinates: { type: [Number], index: '2dsphere' } 
    },
    reviews : [reviewSchema]
}, {
    timestamps: true //automatically add the created at and updated at fields
});


//create this schema and export for other files
const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;