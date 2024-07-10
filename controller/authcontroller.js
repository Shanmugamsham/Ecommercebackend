const User = require('../models/usermodels');
const sendtoken=require("../utils/jsw")
const sendEmail=require("../utils/email")
const crypto=require("crypto")


//Register User - /register

exports.registerUser=async(req,res,next)=>{
    try {
        const {name, email, password, avatar , role } = req.body
        const user = await User.create({
        name,
        email,
        password,
        avatar,
        role 
    });
    let message="registeruser successfully"
    sendtoken(user,200,res,message)
        
    } catch (error) {
         
        if(error.name == "ValidationError") {
            message = Object.values(error.errors).map(value => value.message)
            return res.status(400).json({message:message})
        }


        if(error.code == 11000) {
            let message = `Duplicate ${Object.keys(error.keyValue)} ID error or mail id ready registered`;
            return res.status(400).json({msg:message})
          }
          res.status(500).json({
            success: false,
            message: error.message || 'Internal Server Error',
        })

    }
    
}

//Login User - /login
exports.loginUser=async(req,res,next)=>{
    try {
        const {email,password}=req.body

    if(!email){
        return res.status(400).json({msg:"please enter your mail id"})
    }
    if(!password){
        return  res.status(400).json({msg:"please enter your password"})
}
    const user= await User.findOne({email}).select("+password")
    if(!user){
        return  res.status(401).json({msg:"invalid email or password"})
    }
     if(!await user.isValidPassword(password)){
         return  res.status(401).json({msg:"invalid email or password"})
     }
      let message="login successfully"
    sendtoken(user,200,res,message)
    } catch (error) {

        if(error.name == "ValidationError") {
            message = Object.values(error.errors).map(value => value.message)
            return res.status(400).json({msg:message})
        }

         if(err.code == 11000) {
            let message = `Duplicate ${Object.keys(err.keyValue)} error`;
            return res.status(400).json({msg:message})
          }
          res.status(500).json({
            success: false,
            message: error.message || 'Internal Server Error',
        })
        
        }
}


//Logout - /api/v1/logout
exports.logoutuser=async(req,res,next)=>{
   try {
    res.cookie("token",null,{
        expires:new Date(Date.now())
    }).json({
        success:true,
        message:"logout successfully",
       
    })
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

//Forgot Password - /password/forgot


exports.forgotpassword=async(req,res,next)=>{
   
    const user =  await User.findOne({email: req.body.email});
    try {
        if(!user) {
            return  res.status(401).json({message:"user is not found"})
        }
    
        const resetToken = await user.getResetToken();
        await user.save({validateBeforeSave: false})
    
        //Create reset url
        const reseturl = `${req.protocol}://${req.get('host')}/password/reset/${resetToken}`
       
        const message=`your password reset url is as follows \n\n${reseturl}\n\n if you have not requested this mail`
    
        
        try{
            sendEmail({
                email: user.email,
                subject: "JVLcart Password Recovery",
                message
            })
    
            res.status(200).json({
                success: true,
                message: `Email sent to ${user.email}`
            })
    
        }catch(error){
            user.resetPasswordToken = undefined;
            user.resetPasswordTokenExpire = undefined;
            await user.save({validateBeforeSave:false});
            return res.status(500).json({message:error})
        }
    } catch (error) {
        if(error.name == "ValidationError") {
            message = Object.values(error.errors).map(value => value.message)
            return res.status(400).json({message:message})
        }
        res.status(500).json({
            success: false,
            message: error.message || 'Internal Server Error',
        })
    }
  
    
 } 

 //Reset Password - /password/reset/:token
 exports.resetPassword=async(req,res,next)=>{
    const resetPasswordToken =  crypto.createHash('sha256').update(req.params.token).digest('hex'); 
    try {
        
    const user = await User.findOne( {
        resetPasswordToken,
        resetPasswordTokenExpire: {
            $gt : Date.now()
        }
    } )

    if(!user) {
        return res.status(400).json({message:"Password reset token is invalid or expired"})
    }
    
    if( req.body.password !== req.body.confirmPassword) {
        return res.status(400).json({message:"Password does not match"})
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpire = undefined;
    await user.save({validateBeforeSave: false})
    let message="resetpassword successfully"
    sendtoken(user,200,res,message)
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
//Get User Profile -/myprofile
exports.getUserProfile =async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id)
    res.status(200).json({
         success:true,
         message:"get profile successfully",
         user
    })
    } catch (error) {

        if(error.name == "ValidationError") {
            message = Object.values(error.errors).map(value => value.message)
            return res.status(400).json({message:message})
        }
        res.status(500).json({
            success: false,
            message: error.message || 'Internal Server Error',
        })
    }
 }

 
//Change Password  - api/v1/password/change
exports.changePassword  = async (req, res, next) => {
   try {
        const user = await User.findById(req.user.id).select('+password');
        //check old password

        if(!await user.isValidPassword(req.body.oldPassword)) {
        return res.status(401).json({message:'Old password is incorrect'});
    }

    //assigning new password
            user.password = req.body.password;
            await user.save();
            res.status(200).json({
            message:"changed password successfully",
            success:true,
    })
   } catch (error) {
    
    if(error.name == "ValidationError") {
        message = Object.values(error.errors).map(value => value.message)
        return res.status(400).json({message:message})
    }
    res.status(500).json({
        success: false,
        message: error.message || 'Internal Server Error',
    })
   }
 }


 
//Update Profile - /api/v1/update
exports.updateProfile =async (req, res, next) => {
    try {
        let newUserData = {
            name: req.body.name,
            email: req.body.email
        }
    
        const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
            new: true,
            runValidators: true,
        })
    
        res.status(200).json({
            success: true,
            message:"product updatedsuccessfully",
            user
        })
    } catch (error) {
        if(error.name == "ValidationError") {
            message = Object.values(error.errors).map(value => value.message)
            return res.status(400).json({message:message})
        }
        res.status(500).json({
            success: false,
            message: error.message || 'Internal Server Error',
        })
       }
    }

exports.getAllUsers = async (req, res, next) => {
        try {
            const users = await User.find();
            res.status(200).json({
                 success: true,
                 message:"getalluser successfully",
                 users
        })
        } catch (error) {
            if(error.name == "ValidationError") {
                message = Object.values(error.errors).map(value => value.message)
                return res.status(400).json({message:message})
            }
            res.status(500).json({
                success: false,
                message: error.message || 'Internal Server Error',
            })
           }
        }
     
// Get Specific User - api/v1/admin/user/:id

 exports.getUser =async (req, res, next) => {

     try {
        const user = await User.findById(req.params.id);
    if(!user) {
    return res.status(401).json({
        success:false,
        message:`User not found with this id ${req.params.id}`
              })
    
            }
    res.status(200).json({
     success: true,
     message:"getuser successfully",
     user
           })
     } catch (error) {
        if(error.name == "ValidationError") {
            message = Object.values(error.errors).map(value => value.message)
            return res.status(400).json({message:message})
        }
        res.status(500).json({
            success: false,
            message: error.message || 'Internal Server Error',
        })
     }
        };
        
        exports.updateUser = async (req, res, next) => {
           try {
            const newUserData = {
                name: req.body.name,
                email: req.body.email,
                role: req.body.role
            }
        
            const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
                new: true,
                runValidators: true,
            })
        
            res.status(200).json({
                success: true,
                message:"updateUser successfully",
                user
            })
           } catch (error) {

            if(error.name == "ValidationError") {
                message = Object.values(error.errors).map(value => value.message)
                return res.status(400).json({message:message})
            }
            res.status(500).json({
                success: false,
                message: error.message || 'Internal Server Error',
            })
           }
        }

        exports.deleteUser = async (req, res, next) => {
            try {
                const user = await User.findById(req.params.id);
            if(!user) {
                return res.status(400).json({mesage:`User not found with this id ${req.params.id}`}) 
            }
            await User.findByIdAndDelete(req.params.id)
            res.status(200).json({
                success: true,
                message:"deleteUser successfully"
            })
            } catch (error) {
                if(error.name == "ValidationError") {
                    message = Object.values(error.errors).map(value => value.message)
                  
                }
                res.status(500).json({
                    success: false,
                    message: error.message || 'Internal Server Error',
                })
               }
            }
        