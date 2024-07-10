const router=require("express").Router()
const {getproducts, newProduct, singleproduct, updateproduct, deteleproduct, createReview, getReviews, deleteReview } = require("../controller/productcontoller");
const {isAutheticate,authorizeRoles}=require("../middleware/authendicate")


router.get("/products",isAutheticate,getproducts)
router.post("/product/new",isAutheticate,authorizeRoles("admin"),newProduct)
router.get("/product/:id",isAutheticate,authorizeRoles("admin"),singleproduct)
router.put("/product/:id",isAutheticate,authorizeRoles("admin"),updateproduct)
router.delete("/product/:id",isAutheticate,authorizeRoles("admin"),deteleproduct)
router.put("/review",isAutheticate,createReview)
router.get("/reviews",isAutheticate,getReviews)
router.delete("/reviews",isAutheticate,deleteReview)
router.get("/reviews",isAutheticate,getReviews)
module.exports=router