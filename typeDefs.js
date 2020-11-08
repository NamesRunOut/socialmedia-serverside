const {gql} = require('apollo-server')

module.exports = gql`
  type Post{
    id: ID!
    username: String!
    type: String!
    title: String!
    sauce: String!
    created_at: String!
    expires_in_seconds: String!
    color: String!
    likes: [Like]!
    comments: [Comment]!
    like_count: Int!
    comment_count: Int!
  }
  type Comment{
    id: ID!
    username: String!
    sauce: String!
    created_at: String!
  }
  type Like{
    id: ID!
    username: String!
    created_at: String!
  }
  type Recipient{
    id: ID!
    username: String!
    created_at: String!
  }
  type Message{
    id: ID!
    username: String!
    sauce: String!
    created_at: String!
  }
  type Thread{
    id: ID!
    group_name: String!
    picture: String!
    color: String!
    creator: String!  
    created_at: String!
    recipients: [Recipient]!
    messages: [Message]!
  }
  type Follow{
    id: ID!
    username: String!
    created_at: String!
  }
  type Query{
    getPosts: [Post]
    getPost(postid: ID!): Post
    getThreads: [Thread]
    getThread(threadid: ID!): Thread
    getUsers: [User]
    getUser(userid: ID!): User
  }
  type User{
    id: ID!
    email: String!
    token: String!
    username: String!
    created_at: String!
    followers: [Follow]!
    follows: [Follow]!
    followers_count: Int!
    follows_count: Int!
  }
  input RegisterInput{
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
  }
  type Mutation {
    register(registerInput: RegisterInput): User!
    login(username: String!, password: String!): User!
    follow(userid: ID!): User!
    createPost(type: String!, title: String!, sauce: String!, expiration: String!, color: String!): Post!
    deletePost(postid: ID!): String!
    createComment(postid: ID!, sauce: String!): Post!
    deleteComment(postid: ID!, commentid: ID!): Post!
    likePost(postid: ID!): Post!
    createThread(group_name: String!, picture: String!, color: String!, recipients: [String]!): Thread!
    deleteThread(threadid: ID!): String!
    writeMessage(threadid: ID!, sauce: String!): Thread!
  }
  type Subscription{
    newPost: Post!
  }
`