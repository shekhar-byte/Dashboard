const mongoose = require('mongoose')
const Schema = mongoose.Schema
const passportLocalMongoose = require('passport-local-mongoose')


const profileSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    occupation: {
        type: String,
        required: true
    },
    dob: {
        type: String,
        required: true
    },
    hobbies: {
        type: String,
        required: true
    },
    imgUrl: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

module.exports = mongoose.model('Profile', profileSchema)