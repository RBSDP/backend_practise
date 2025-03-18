import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name : String,
    email : String,
    password : String,
    role : {
        type : String,
        enum : ["user", "admin"], //we user enum when we allow only cretain values for current feild
        default : "user"
    },
    isVerified : {
        type : 'boolen',
        default : false 
    },
    verificationToken : {
        type : String
    },
    resetPasswordToken : {
        type : String
    },
   resetPasswordExpires : {
        type : Date,
    }

}, {
    timestamps : true  // once we make timstamps true, mongoose adds two mew feild in DB 1) created at 2) updated at
    
})


const User = mongoose.model("User", userSchema)

export default User