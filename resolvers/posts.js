const {AuthenticationError} = require('apollo-server')

const Post = require('../Models/Post');
const isauth = require('../utils/isauth');

module.exports = {
    Query: {
      async getPosts(){
        try{
          const posts = await Post.find().sort({created_at: -1});
          return posts;
        }
        catch(err){
          throw new Error(err)
        }
      },
      async getPost(_, {postid}){
        try{
          const post = await Post.findById(postid)
          if(post){
            return post
          } else {
            throw new Error('Post not found')
          }
        } catch(err) {
          throw new Error(err)
        }
      }
    },
    Mutation: {
      async createPost(_, {type, title, sauce, expiration, color}, context) {
        const user = isauth(context)

        // add empty post parameters validation

        const newPost = new Post({
          type,
          title,
          sauce,
          user: user.id,
          username: user.username,
          created_at: new Date().toISOString(),
          expires_in_seconds: expiration,
          color: color
        })

        const post = await newPost.save()
        context.pubsub.publish('NEW_POST', {
          newPost: post
        })

        return post
      },
      async deletePost(_, {postid}, context){
        const user = isauth(context)
        
        try {
          const post = await Post.findById(postid)
          if (user.username === post.username){
            await post.delete()
            return 'Post deleted successfully'
          } else {
            throw new AuthenticationError('Action not allowed')
          }
        } catch(err) {
          throw new Error(err)
        }     
      }
    },
    Subscription: {
      newPost: {
        subscribe: (_, __, {pubsub}) => pubsub.asyncIterator('NEW_POST')
      }
    }
  }