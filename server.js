const port = process.env.PORT || 4001;

const { ApolloServer, PubSub } = require('apollo-server')
const gql = require('graphql-tag')
const mongoose = require('mongoose')

const typeDefs = require('./typeDefs')
const resolvers = require('./resolvers/resolvers')

const pubsub = new PubSub()

mongoose.connect(process.env.MONGODB, {useNewUrlParser: true})
  .then(() => {
    console.log("MongoDB connection established")
    return server.listen({port: port})
  })
  .then((response) => {
    console.log(`Server running at port ${response.url}`)
  })
    .catch(err => {
        console.error(err)
    })

const server = new ApolloServer({
  cors: {
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true
  },
  typeDefs,
  resolvers,
  context: ({req}) => ({req, pubsub})
});