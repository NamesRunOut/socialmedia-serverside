const {AuthenticationError} = require('apollo-server')

const Thread = require('../Models/Thread');
const isauth = require('../utils/isauth');

module.exports = {
    Query: {
      async getThreads(_, __, context){
          //const user = isauth(context)
          // TODO fetch only conversations user is a recipient of
        try{
          const tmp = await Thread.find().sort({created_at: -1});
          const threads = tmp;
          // get the right threads
          return threads;
        }
        catch(err){
          throw new Error(err)
        }
      },
      async getThread(_, {threadid}){
        try{
          const thread = await Threads.findById(threadid)
          if(thread){
            return thread
          } else {
            throw new Error('Thread not found')
          }
        } catch(err) {
          throw new Error(err)
        }
      }
    },
    Mutation: {
      async createThread(_, {group_name, picture, color, recipients}, context) {
        const user = isauth(context)

        // add empty post parameters validation
 
        let rec = [];
        for (let i=0;i<recipients.length;i++) [
            rec[i] = {
                username: recipients[i]
            }
        ]
        rec.push(user.username)
        //console.log(recipients, rec)
        const newThread = new Thread({
          group_name,
          picture,
          user: user.id,
          creator: user.username,
          created_at: new Date().toISOString(),
          color: color,
          recipients: rec,
          messages: []
        })

        const thread = await newThread.save()
        return thread
      },
      async writeMessage(_, {threadid, sauce}, context) {
        const {username} = isauth(context)
    // TODO add authentication, so users can only write to threads they have access to
        const thread = await Thread.findById(threadid)
        if (thread) {
            thread.messages.push({
                username,
                sauce,
                created_at: new Date().toISOString()
            })
            await thread.save()
            return thread
        } else {
            throw new UserInputError('Thread not found')
        }
    },
      async deleteThread(_, {threadid}, context){
        const user = isauth(context)

        try {
          const thread = await Thread.findById(threadid)
          if (user.username === thread.creator){
            await thread.delete()
            return 'Thread deleted successfully'
          } else {
            throw new AuthenticationError('Action not allowed')
          }
        } catch(err) {
          throw new Error(err)
        }     
      }
    }
  }