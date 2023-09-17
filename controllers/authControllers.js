const User = require('../models/User')
const bcrypt = require('bcryptjs')

exports.signup = async (req, res, next) => {
    try {
        const { email } = req.body;
        const match = await User.findOne({ email });

        if (match) {
            return res.send("User already exists");
        }
        const user = new User(req.body);

        await user.save();
        res.send(user);

    } catch (error) {
        console.error(error); // Log the error for debugging purposes
        res.status(500).send("An error occurred. Please try again later.");
    }
}

exports.login = async (req, res, next) => {
    try {
        const {email, password} = req.body;
        if(!email || !password){
            throw new Error("Please enter all required fields")
        }
        const user = await User.findOne({email});
        if(!user){
            res.status(202).send("Incorrect Login Details");
        }
        const check = await bcrypt.compare(password, user.password);
        if(!check){
            res.status(202).send("Incorrect Login Details");
        }
        const token = await user.generateAuthToken();
        
        res.cookie('jwtoken', token, {
            maxAge: 86400000,
            httpOnly: true,
        })

        res.send(user.roles)

    } catch (error) {
        console.error('Error occurred:', error.message);
        res.status(500).send('Something went wrong!');
    }
}

exports.logout = async (req, res, next) => {
    try {
        await User.updateOne(
            {_id: req.user._id},
            {$pull: {tokens: {token: req.token}}}
        ).then((result)=>{
            if (result.modifiedCount > 0) {
                res.cookie('jwtoken', "" ,{
                    maxAge: 86400000,
                    httpOnly: true,
                })
                res.status(201).send('Token deleted successfully.');
            } else {
                res.status(404).send('Token not found in the tokens array.');
            }
        }).catch((err)=>{
            console.error(err);
            return res.status(500).send("Some Error occured")
        })
    } catch (error) {
        console.error('Error occurred:', error.message);
        res.status(500).send('Something went wrong!');
    }
}