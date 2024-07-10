const User = require('../models/usermodels')
const jwt = require('jsonwebtoken');
require('dotenv').config()

exports.isAutheticate=async(req,res,next)=>{
    
   try {
    const { token  }  = req.cookies;
    if( !token ){
        return res.status(400).json({msg:'Login first to handle this resource'})
   }
   const decoded = jwt.verify(token, process.env.JSW_SECRETKEY)
   req.user = await User.findById(decoded.id)
   next();
   } catch (error) {
    if(error.name == 'JSONWebTokenError') {
        let message = `JSON Web Token is invalid. Try again`;
        return res.status(400).json({msg:message})
    }

    if(error.name == 'TokenExpiredError') {
        let message = `JSON Web Token is expired. Try again`;
        return res.status(400).json({msg:message})
        
    }

    res.status(500).json({
        success: false,
        message: error.message || 'Internal Server Error',
   })


}}

exports.authorizeRoles = (...roles) => {
  try {
    return  (req, res, next) => {
        if(!roles.includes(req.user.role)){
            return res.status(401).json({msg:`Role ${req.user.role} is not allowed`})
        }
        next()
    }
  } catch (error) {
    if(error.name == "ValidationError") {
        message = Object.values(error.errors).map(value => value.message)
        return res.status(400).json({msg:message})
    }
    res.status(500).json({
        success: false,
        message: error.message || 'Internal Server Error',
   })
  }
   
 }   