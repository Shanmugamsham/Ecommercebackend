const product=require("../data/product.json")
const products=require("../models/productmodels")
const databaseconnection=require("../database/databaseconfic")
const dotenv=require("dotenv")
dotenv.config()
databaseconnection()

const seedproduct=async()=>{
      try {
        await products.deleteMany()
        console.log("deleted successfully");
        await products.insertMany(product)
        console.log('All products added!');
      } catch (error) {
        console.log(error.message);
      }
      process.exit()
}
seedproduct()