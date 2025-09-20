const { default: mongoose } = require('mongoose');
const mogoose = require('mongoose');

const petSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required : true,
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
    //for add an image
    // image: {
    //     type: String,
    //     required: false
    // }
}, {
    timestamps: true
})

const Pet = mongoose.model('Pet', petSchema);
module.exports = Pet;