const mongoose=require("mongoose")



const productschema=new mongoose.Schema({
    name:{type:String,
          require:[true,"please enter product name"],
          trim:true,
          maxLength:[100,"product name cannot exceed 100 characters"]
    },
    price:{
        type:Number,
        default:0.0
    },
    description:{
        type:String,
        require:[true,"please enter product description"]
    },
    ratings:{
        type:String,
        default:0
    },
    images:[{
        image:{
            type:String,
            require:true
        }
    }],
    category:{
        type:String,
        require:true,
        enum:{
            values:["Electraonics","Mobile Phones",
                "Laptops","Accessories","Headphones" 
                ,"Food","Books","Clothes/Shoes",
                "Beauty/Health","Sports","Outdoor","Home"],
                message:"Plese select correct catgory"
        }

    },
    seller:{
        type:String,
        require:[true,"please enter product seller"]

    },
    stock:{
        type:Number,
        require:[true,"please enter product stock"],
       
    },
    numOfReviews:{
            type:Number,
            default:0
    },
    reviews:[{
        user:{
            type: mongoose.SchemaTypes.ObjectId,
            required: true, 
             ref: 'User' 
            },
         rating:{
            type:String,
            require:true
         },
         comment:{
            type:String,
            require:true
         }

    }],

    user:{
        type:mongoose.Schema.Types.ObjectId
    },

    createdAt:{
        type:Date,
        default:Date.now()
    }
    
})
const createproduct=mongoose.model("newproduct",productschema)

module.exports=createproduct
