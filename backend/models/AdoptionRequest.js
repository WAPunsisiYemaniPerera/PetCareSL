const mongoose = require('mongoose');

const adoptionRequestSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref: 'User'
    },
    pet: {
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Pet'
    },
    contactNumber: {
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    },
    status:{
        type:String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    }
}, {
    timestamps:true
});

const AdoptionRequest = mongoose.model('AdoptionRequest', adoptionRequestSchema);
module.exports = AdoptionRequest;