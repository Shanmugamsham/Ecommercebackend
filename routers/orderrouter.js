const { newOrder, getSingleOrder, myOrders, orders, updateOrder, deleteOrder } = require("../controller/ordercontroller")
const { isAutheticate, authorizeRoles } = require("../middleware/authendicate")

const router=require("express").Router()


router.post("/order/new",isAutheticate,newOrder)
router.post("/order/:id",isAutheticate,getSingleOrder)
router.get("/myorder",isAutheticate,myOrders)


router.get("/orders",isAutheticate,authorizeRoles("admin"),orders)
router.put("/order/:id",isAutheticate,authorizeRoles("admin"),updateOrder)
router.delete("/order/:id",isAutheticate,authorizeRoles("admin"),deleteOrder)


module.exports=router