const postResolvers = require('./posts')
const userResolvers = require('./users')
const commentsResolvers = require('./comments')
const likesResolvers = require('./likes')
const threadResolvers = require('./threads')

module.exports = {
    Post: {
        like_count: (parent) => parent.likes.length,
        comment_count: (parent) => parent.comments.length
    },
    User: {
        followers_count: (parent) => parent.followers.length,
        follows_count: (parent) => parent.follows.length
    },
    Query: {
        ...postResolvers.Query,
        ...userResolvers.Query,
        ...threadResolvers.Query
    },
    Mutation: {
        ...userResolvers.Mutation,
        ...postResolvers.Mutation,
        ...commentsResolvers.Mutation,
        ...likesResolvers.Mutation,
        ...threadResolvers.Mutation
    },
    Subscription: {
        ...postResolvers.Subscription
    }
}