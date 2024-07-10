const Order = require('../models/ordermodels');
const Product = require('../models/productmodels');

//Create New Order - /order/new
exports.newOrder =async (req, res, next) => {

   try {
    const {
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo
    } = req.body;

    const order = await Order.create({
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
        paidAt: Date.now(),
        user: req.user.id
    })

    res.status(200).json({
        success: true,
        order
    })
   } catch (error) {
    if(error.name == "ValidationError") {
        message = Object.values(error.errors).map(value => value.message)
        return res.status(400).json({msg:message})
    }
      res.status(400).json({
        success: false,
        message: error.message || 'Internal Server Error',
    })
   }
}

exports.getSingleOrder = async (req, res, next) => {
   try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if(!order) {
        return res.status(400).json({success:false,msg:`Order not found with this id: ${req.params.id}`}) 
    }

    res.status(200).json({
        success: true,
        order
    })
   } catch (error) {
    if(error.name == "ValidationError") {
        message = Object.values(error.errors).map(value => value.message)
        return res.status(400).json({msg:message})
    }
      res.status(400).json({
        success: false,
        message: error.message || 'Internal Server Error',
    })
   }
}

exports.myOrders =async (req, res, next) => {
   try {
    const orders = await Order.find({user: req.user.id});

    res.status(200).json({
        success: true,
        orders
    })
   } catch (error) {
    if(error.name == "ValidationError") {
        message = Object.values(error.errors).map(value => value.message)
        return res.status(400).json({msg:message})
    }
      res.status(400).json({
        success: false,
        message: error.message || 'Internal Server Error',
    })
   }
}


//Admin: Get All Orders 

exports.orders =async (req, res, next) => {
    try {
        const orders = await Order.find();

    let totalAmount = 0;

    orders.forEach(order => {
        totalAmount += order.totalPrice
    })

    res.status(200).json({
        success: true,
        totalAmount,
        orders
    })
    } catch (error) {
        if(error.name == "ValidationError") {
            message = Object.values(error.errors).map(value => value.message)
            return res.status(400).json({msg:message})
        }
          res.status(400).json({
            success: false,
            message: error.message || 'Internal Server Error',
        })
    }
}



exports.updateOrder =async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);

    if(order.orderStatus == 'Delivered') {
        return res.status(401).json({success:false,msg:"Order has been already delivered!"}) 
       
    }
    //Updating the product stock of each order item
    order.orderItems.forEach(async orderItem => {
        await updateStock(orderItem.product, orderItem.quantity)
    })

    order.orderStatus = req.body.orderStatus;
    order.deliveredAt = Date.now();
    await order.save();

    res.status(200).json({
        success: true
    })
    
    } catch (error) {
        if(error.name == "ValidationError") {
            message = Object.values(error.errors).map(value => value.message)
            return res.status(400).json({msg:message})
        }
          res.status(400).json({
            success: false,
            message: error.message || 'Internal Server Error',
        })
    }
};

async function updateStock (productId, quantity){
    const product = await Product.findById(productId);
    product.stock = product.stock - quantity;
    product.save({validateBeforeSave: false})
}

exports.deleteOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);
    if(!order) {
        return res.status(404).json({success:false,msg:`Order not found with this id: ${req.params.id}`}) 
    }

    await Order.findByIdAndDelete(req.params.id)
    
    res.status(200).json({
        success: true,
        msg:"order deleted successfully"
    })
    } catch (error) {
        if(error.name == "ValidationError") {
            message = Object.values(error.errors).map(value => value.message)
            return res.status(400).json({msg:message})
        }
          res.status(400).json({
            success: false,
            message: error.message || 'Internal Server Error',
        })
    }
}