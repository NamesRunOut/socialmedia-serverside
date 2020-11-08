const { UserInputError } = require('apollo-server')

const Post = require('../Models/Post')
const isauth = require('../utils/isauth')

module.exports = {
    Mutation: {
        likePost: async (_, {postid}, context) => {
            const {username} = isauth(context)
        
            const post = await Post.findById(postid)
            if (post) {
                if (post.likes.find(like => like.username === username)) {
                    post.likes = post.likes.filter(like => like.username !== username)
                } else {
                    post.likes.push({
                        username,
                        created_at: new Date().toISOString()
                    })
                }
                await post.save()
                return post
            } else {
                throw new UserInputError('Post not found')
            }
        }
    }
}