const mongoose = require('mongoose')
const Schema = mongoose.Schema
const passportLocalMoongoose = require('passport-local-mongoose')



const userSchema = new Schema({
    email: {
        type: String,
        require: true,
        unique: true
    }
})

userSchema.plugin(passportLocalMoongoose, { usernameField: 'email' })

module.exports = mongoose.model('User', userSchema)