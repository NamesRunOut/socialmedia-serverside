const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {UserInputError} = require('apollo-server')

const {ENCRYPTION_KEY} = require('../dbconfig.js')
const {validateRegisterInput, validateLoginInput} = require('../utils/validator')
const isauth = require('../utils/isauth')
const User = require('../Models/User')

function generateToken(user){
    return jwt.sign({
        id: user.id,
        email: user.email,
        username: user.username
    }, ENCRYPTION_KEY || process.env.ENCRYPTION_KEY,
        { expiresIn: '1h'}
    );
}

module.exports = {
    Query: {
        async getUsers() {
            try {
                const tmp = await User.find().sort({created_at: -1});
                let users = [];
                for (let i = 0; i < tmp.length; i++) {
                    users[i] = {
                        id: tmp[i].id,
                        username: tmp[i].username,
                        follows: tmp[i].follows,
                        followers: tmp[i].followers
                    }
                }
                //console.log(users)
                return users;
            } catch (err) {
                throw new Error(err)
            }
        },
        async getUser(_, {userid}) {
            try {
                const user = await User.findById(userid)
                if (user) {
                    return {
                        id: user.id,
                        username: user.username,
                        follows: user.follows,
                        followers: user.followers
                    }
                } else {
                    throw new Error('User not found')
                }
            } catch (err) {
                throw new Error(err)
            }
        },
    },
    Mutation: {
        async login(_, {username, password}) {
            const {errors, valid} = validateLoginInput(username, password)
            if (!valid) {
                throw new UserInputError('Errors', {errors})
            }

            const user = await User.findOne({username})

            if (!user){
                errors.general = "User not found"
                throw new UserInputError("User not found", {errors})
            }

            const match = await bcrypt.compare(password, user.password);
            if (!match){
                errors.general = "Wrong password"
                throw new UserInputError("Wrong password", {errors})
            }

            const token = generateToken(user)
            return {
                ...user._doc,
                id: user._id,
                token
            }
        },
        async register(_, 
            { 
                registerInput: {username, email, password, confirmPassword}
            }, 
            context, 
            info
            ) {
                const {valid, errors} = validateRegisterInput(username, email, password, confirmPassword)
                if (!valid) {
                    throw new UserInputError('Errors', {errors})
                }
                const user = await User.findOne({ username});
                if (user) {
                    throw new UserInputError('Username is taken', {
                        errors: {
                            username: 'This username is taken'
                        }
                    })
                }
                password = await bcrypt.hash(password, 12)
                const newUser = new User({
                    email,
                    username,
                    password,
                    created_at: new Date().toISOString()
                })
                const res = await newUser.save() 

                const token = generateToken(res)
                return {
                    ...res._doc,
                    id: res._id,
                    token
                }
            },
        async follow(_, {userid}, context){
            const user = isauth(context)
            try {
                const newfollower = await User.findById(user.id)
                const target = await User.findById(userid)
                if (newfollower && target) {
                    if (newfollower.username === target.username) throw new UserInputError('You cannot follow yourself')
                    const date = new Date().toISOString()
                    if (newfollower.follows.find(f => f.username === target.username)) {
                        newfollower.follows = newfollower.follows.filter(f => f.username !== target.username)
                    } else {
                        newfollower.follows.push({
                            username: target.username,
                            created_at: date
                        })
                    }
                    if (target.followers.find(f => f.username === user.username)) {
                        target.followers = target.followers.filter(f => f.username !== user.username)
                    } else {
                        target.followers.push({
                            username: user.username,
                            created_at: date
                        })
                    }
                    await target.save()
                    await newfollower.save()
                    return {
                        id: target.id,
                        username: target.username,
                        follows: target.follows,
                        followers: target.followers
                    }
                } else {
                    throw new UserInputError('User not found')
                }
            } catch(err) {
                throw new Error(err)
            }
        }
    }
}