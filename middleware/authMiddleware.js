const jwt = require('jsonwebtoken');
const UserModel = require('../models/user.schema');

const authMiddleware = async (req, res, next) => {
    // const token = req.headers.authorization;
    const token = req.header('Authorization').replace('Bearer ', '');
    
    //              check if the token is present or not
    if(!token) {
        return res.json({status: false, message: "Authentication failed"});
    }

    try {
        //          Verify the token using the secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await UserModel.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({ message: 'Authentication failed' });
        }

        req.user = user;        // Attach user to request object
        // Proceed to the next middleware or route handler
        next();
    } catch (err) {
        console.log(err);
        res.json({status: false, message: "Invalid token"});
    }
};

module.exports = authMiddleware;
