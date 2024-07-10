
const mongoose=require("mongoose")
const database=async()=>{
    await  mongoose.connect(process.env.MONGODB_URL)
   .then(()=>console.log("data base connecton sucess")).catch(()=>console.log("data base connecton fail"))
}

module.exports=database