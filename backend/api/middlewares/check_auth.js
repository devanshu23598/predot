const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token, '65TG7G');
        req.authData = decoded;
        next();
    } catch(error) {
        return res.status(401).json({
            response: false,
            msg: 'Authorization Failed'
        });
    }
};