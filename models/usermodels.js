const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto=require("crypto")
require('dotenv').config()
const userSchema = new mongoose.Schema({
    name : {
        type: String,
        required: [true, 'Please enter name']
    },
    email:{
        type: String,
        required: [true, 'Please enter email'],
        unique: true,
        validate: [validator.isEmail, 'Please enter valid email address']
    },
    password: {
        type: String,
        required: [true, 'Please enter password'],
        maxlength: [6, 'Password cannot exceed 6 characters'],
        select: false
    },
    avatar: {
        type: String
    },
    role :{
        type: String,
        default: 'user'
    },
    resetPasswordToken: String,
    resetPasswordTokenExpire: Date,
    createdAt :{
        type: Date,
        default: Date.now
    }
})
userSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        next();
    }
    this.password=  await bcrypt.hash(this.password,10)
})

userSchema.methods.getJWTtoken= async function(){
    return jwt.sign({id: this.id}, process.env.JSW_SECRETKEY, {
        expiresIn: process.env.JSW_EXPIRES_TIME
    })
}
userSchema.methods.isValidPassword = async function(enteredPassword){
    return  bcrypt.compare(enteredPassword, this.password)
}

userSchema.methods.getResetToken=async function(){
    const token= crypto.randomBytes(20).toString("hex")
   
    this.resetPasswordToken= crypto.createHash('sha256').update(token).digest("hex")

    this.resetPasswordTokenExpire=Date.now()+30*60*1000

    return token
}

let model =  mongoose.model('User', userSchema);
module.exports = model;