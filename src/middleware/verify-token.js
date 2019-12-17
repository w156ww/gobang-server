const jwt = require('jsonwebtoken');
const util = require('util');
const verify = util.promisify(jwt.verify);



async function verifyToken(token, secret, success, error) {
    try {
        const payload = await verify(token, secret);
        success(payload)
    } catch (e) {
        error(e);
    }
}


module.exports = {
    verifyToken
}





