const {model, Schema} = require('mongoose')

const postSchema = new Schema({
    username: String,
    type: String,
    title: String,
    sauce: String,
    created_at: String,
    expires_in_seconds: String,
    //expired: String, // add true or false for expired and when fetching search for ones that arent
    color: String,
    comments: [{
        username: String,
        sauce: String,
        created_at: String
    }],
    likes: [{
        username: String,
        created_at: String
    }],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    }
})

module.exports = model('Post', postSchema)