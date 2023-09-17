const jwt = require('jsonwebtoken')
const User = require('../models/User')

const Authenticate = async (req, res, next) => {
    try {
        // console.log(req.headers);
        // const token = req.headers.cookie.split("=")[1]; //Req from postman
        // const token = req.cookie.split("jwtoken=")[1]; //Req for browser

        const cookieSegments = req.headers.cookie.split('; ');

        // Initialize a variable to store the token value
        let token = null;

        // Loop through the segments to find the jwtoken segment
        for (const segment of cookieSegments) {
            if (segment.startsWith('jwtoken=')) {
                const parts = segment.split('=');
                if (parts.length === 2) {
                    token = parts[1];
                    break; // Once found, exit the loop
                }
            }
        }

        if(!token || token.length === 0){
            return res.status(200).send("No token provided")
        }

        // console.log(token)

        const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
        if (!verifyToken) {
            throw new Error('Invalid Token');
        }

        const user = await User.findOne({ _id: verifyToken._id, "tokens.token": token });
        if (!user) {
            throw new Error('No user found');
        }

        req.token = token;
        req.user = user;
        req.userId = user._id;
        next();

    } catch (error) {
        res.status(401).send('Unauthorized: Error with the provided token');
        console.log(error);
    }
}

module.exports = Authenticate