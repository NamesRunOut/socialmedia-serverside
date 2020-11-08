const jwt = require('jsonwebtoken')
const {AuthenticationError} = require('apollo-server')

const {ENCRYPTION_KEY} = require('../dbconfig')

module.exports = (context) => {
    const authHeader = context.req.headers.authorization

    if (authHeader) {
        const token = authHeader.split('Bearer ')[1]
        if (token){
            try {
                const user = jwt.verify(token, ENCRYPTION_KEY || process.env.ENCRYPTION_KEY)
                return user
            } catch(err) {
                throw new AuthenticationError('Invalid/Expired token')
            }
        }
        throw new Error('Authentication token must be \'Bearer [token]')
    }
    throw new Error('You must provide an Authentication token')
}