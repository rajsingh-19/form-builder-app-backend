const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
const UserModel = require('../models/user.schema');

dotenv.config();

const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization;
    
    //              check if the token is present or not
    if(!token) {
        res.json({status: false, message: "Authentication failed"});
        return;
    }

    try {
        //          Verify the token using the secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await UserModel.findById(decoded.id);

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
