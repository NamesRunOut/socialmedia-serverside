const {model, Schema} = require('mongoose')

const userSchema = new Schema({
    username: String,
    password: String,
    email: String,
    created_at: String,
    followers: [{
        username: String,
        created_at: String
    }],
    follows: [{
        username: String,
        created_at: String
    }],
})

module.exports = model('User', userSchema)