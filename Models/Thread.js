const {model, Schema} = require('mongoose')

const threadSchema = new Schema({
    group_name: String,
    created_at: String,
    picture: String,
    color: String,
    creator: String,
    recipients: [{
        username: String
    }],
    messages: [{
        username: String,
        sauce: String,
        created_at: String
    }],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    }
})

module.exports = model('Thread', threadSchema)