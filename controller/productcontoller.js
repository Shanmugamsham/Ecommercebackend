 const productdata=require("../models/productmodels")
 const Apifeature=require("../utils/Apifeature")
 
 
 
 
 
 exports.getproducts=async(req,res,next)=>{

  try {
    const resultperpage=2
    const apifeatures=new Apifeature(productdata.find(),req.query).search().filter().paginate(resultperpage)
      const product=await apifeatures.query;
      return res.status(200).json({date:product,messege:"successfully" ,success:true})

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

exports.newProduct=async(req,res,next)=>{
      


     req.body.user=req.body.id
      const data=req.body

      try {
        const newproduct= await productdata.create(data)
        res.status(200).json({date:newproduct,messege:"products is created successfully"})

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

exports.singleproduct=async(req,res,next)=>{
   

 try {
   
  const singleproduct= await productdata.findById(req.params.id)
  
  if(!singleproduct){
    return res.status(404).json({success:false,msg:"product is not found"})
  }
  
  res.status(200).json({
    success:true,
    singleproduct
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

exports.updateproduct=async(req,res,next)=>{
 
  
    try {
      const product= await productdata.findById(req.params.id)
  
  if(!product){
    return res.status(404).json({success:false,msg:"product is not found"})
  }

  const updateproduct=await productdata.findByIdAndUpdate( req.params.id,
    req.body,
    { new: true, runValidators: true })
 

  res.status(200).json({
    success:true,
    msg:"updatesuccessfuly",
    date:updateproduct
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
exports.deteleproduct=async(req,res,next)=>{
  
  try {
    const deleteproduct= await productdata.findById(req.params.id)
    
    if(!deleteproduct){
      return res.status(404).json({success:false,msg:"product is not found"})
    }

     await productdata.findByIdAndDelete(req.params.id)
    
    res.status(200).json({
      success:true,
      msg:"product deleted successfully"
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

  exports.createReview =async (req, res, next) =>{
   try {
    const  { productId, rating, comment } = req.body;
   

    const review = {
        user : req.user.id,
        rating,
        comment
    }
 
    const product = await productdata.findById(productId);
  
    const isReviewed = product.reviews.find(review => {
       return review.user.toString() == req.user.id.toString()
    })

    if(isReviewed){
      
        product.reviews.forEach(review => {
            if(review.user.toString() == req.user.id.toString()){
                review.comment = comment
                review.rating = rating
            }

        })

    }else{
       
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }
   
    product.ratings = product.reviews.reduce((acc, review) => {
        return review.rating + acc;
    }, 0) / product.reviews.length;
    product.ratings = isNaN(product.ratings)?0:product.ratings;

    await product.save({validateBeforeSave: false});

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

}
exports.getReviews = async (req, res, next) =>{
  const product = await productdata.findById(req.query.id).populate("reviews.user",'name email');

  res.status(200).json({
      success: true,
      reviews: product.reviews
  })
}

exports.deleteReview =async (req, res, next) =>{
  try {
    const product = await productdata.findById(req.query.productId);
  
 
  const reviews = product.reviews.filter(review => {
     return review._id.toString() !== req.query.id.toString()
  });

  const numOfReviews = reviews.length;

 
  let ratings = reviews.reduce((acc, review) => {
      return review.rating + acc;
  }, 0) / reviews.length;
  ratings = isNaN(ratings)?0:ratings;

  
  await productdata.findByIdAndUpdate(req.query.productId, {
      reviews,
      numOfReviews,
      ratings
  })
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

exports.getAdminProducts = async (req, res, next) =>{
  const products = await productdata.find();
  res.status(200).send({
      success: true,
      products
  })
};