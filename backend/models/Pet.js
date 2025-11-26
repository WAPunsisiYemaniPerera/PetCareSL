const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    name: {
        type: String,
        required: true
    },
    petType: {
        type: String,
        required: true,
        enum: ['Dog', 'Cat']
    },
    breed: {
        type: String,
        required: true
    }, 
    age: {
        type: Number,
        required: true
    },
    // --- අලුතින් එකතු කළ Status Field එක ---
    status: {
        type: String,
        required: true,
        enum: ['Owned', 'For Adoption'],
        default: 'Owned'
    },
    story: { type: String },
    shelterInfo: { type: String },
    image: { type: String, default: '/images/sample.jpg' },
    contact: { type: String, required: true },
}, {
    timestamps: true
});

const Pet = mongoose.model('Pet', petSchema);
module.exports = Pet;