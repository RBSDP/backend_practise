import mongoose from "mongoose";

import dotenv from "dotenv"
dotenv.config()

const db = function(){
   mongoose.connect(process.env.MONGO_URL)
   .then(() => { console.log("CONNECTED TO MONGODB")})
   .catch((err) => { console.log("error connecting to mongodb")}) 
}

export default db