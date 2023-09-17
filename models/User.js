const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {roles} = require('../utils/constants')

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        lowercase: true,
        unique: true,
    },
    password:{
        type: String,
        requried: true,
    },
    roles: {
        type: String,
        enum: [roles.admin, roles.client],
        default: roles.client
    },
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ]
})

userSchema.pre('save', async function(next){
    try{
        if(this.isNew){
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(this.password, salt);
            this.password = hashedPassword;
            next();
        }
    } catch(error){
        next(error);
    }
})

userSchema.methods.generateAuthToken = async function(){
    try {
        const token = jwt.sign({_id: this._id}, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token: token})
        await this.save();
        return token;

    } catch (error) {
        console.log(error);
    }
}

const User = mongoose.model('user', userSchema)
module.exports = User