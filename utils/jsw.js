const sendtoken=async(user,statecode,res,message)=>{
   try {
    const token= await  user.getJWTtoken()
     
    const options = {
        expires: new Date(
                Date.now() + 7 * 24 * 60 * 60 * 1000 
            ),
        httpOnly: true,
    }

    return res.status(statecode).cookie('token', token, options).json({
        sucess:true,
        message:message,
        data:user,
        })
   } catch (error) {
    res.status(500).json({msg:error})
   }

}
module.exports=sendtoken
