const { registerUser, loginUser, logoutuser, forgotpassword, resetPassword,
     getUserProfile, changePassword, updateProfile, 
     getAllUsers,getUser,updateUser,deleteUser} = require("../controller/authcontroller")
const { isAutheticate, authorizeRoles } = require("../middleware/authendicate")

const router=require("express").Router()



router.post("/register",registerUser)
router.post("/login",loginUser)
router.post("/logout",logoutuser)
router.post("/password/forgot",forgotpassword);
router.post("/password/reset/:token",resetPassword);
router.get("/myprofile",isAutheticate,getUserProfile);
router.put('/password/change',isAutheticate,changePassword)
router.put("/update",isAutheticate,updateProfile)
router.get("/admin/users",isAutheticate,authorizeRoles("admin"),getAllUsers)
router.get("/admin/user/:id",isAutheticate,authorizeRoles("admin"),getUser)
router.put("/admin/user/:id",isAutheticate,authorizeRoles("admin"),updateUser)
router.delete("/admin/user/:id",isAutheticate,authorizeRoles("admin"),deleteUser)
module.exports=router