const { UserInputError, AuthenticationError } = require('apollo-server')

const Post = require('../Models/Post')
const isauth = require('../utils/isauth')

module.exports = {
    Mutation: {
        createComment: async (_, {postid, sauce}, context) => {
            const {username} = isauth(context)

            if (sauce.trim() === '') {
                throw UserInputError('Empty comment', {
                    errors: {
                        body: 'Comments cannot be empty'
                    }
                })
            }

            const post = await Post.findById(postid)

            if (post) {
                post.comments.unshift({
                    sauce,
                    username,
                    created_at: new Date().toISOString()
                })
                await post.save()
                return post
            } else {
                throw new UserInputError('Post not found')
            }
        },
        deleteComment: async (_, {postid, commentid}, context) => {
            const {username} = isauth(context)

            const post = await Post.findById(postid)

            if (post) {
                const comment = post.comments.findIndex(c => c.id === commentid)
                if (post.comments[comment].username === username) {
                    post.comments.splice(comment, 1)
                    await post.save()
                    return post
                } else {
                    throw new AuthenticationError('Not allowed')
                }
            } else {
                throw new UserInputError('Post not found')
            }
        }
    }
}