const expressJwt = require('express-jwt');
const config = require('../config');
const userService = require('../users/user.service');

module.exports = jwt;

function jwt() {
    console.log("inside authenitcate");
    const {secret} = config;
    return expressJwt({secret, isRevoked}).unless({
        path: ['/users/authenticate',
    '/users/register']
    });
}

async function isRevoked(req, payload, done) {

    const user = await userService.getById(payload.sub);

    //revoke token if user no longer exists
    if(!user) {
        return done(null, true);
    }

    done();
}