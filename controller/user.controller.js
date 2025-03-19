import User from "../model/User.model";
import nodemailer from "nodemailer"
import crypto from 'crypto'
const registerUser = async (reg,res) =>{



    const {name, email, password} = req.body

    // validation
    if(!name || !email || !password){
        return res.status(400).json({
            message : "All feilds are required"
        })
    }

    // check if user exists

    try {
       const existingUser = await User.findOne({email})
       if(existingUser){
        return res.status(400).json({
            message : "user already exists"
        })
       }


       //creating user is database

       const user = await User.create({
        name,email,password
       })


       if(!user){
            return res.status(400).json({
                message : "user not registered"
            })
       }

    //    creating a token
    const token = crypto.randomBytes(32).toString('hex')
    console.log(token)
    user.verificationToken = token
    await user.save()

    // send email

    const transporter = nodemailer.createTransport({
        host: process.env.MAILTRAP_HOST,
        port: process.env.MAILTRAP_PORT,
        secure: false, // true for port 465, false for other ports
        auth: {
          user: process.env.MAILTRAP_USERNAME,
          pass: process.env.MAILTRAP_PASSWORD,
        },
      });
      
      const mailOption = {
        from: process.env.MAILTRAP_SENDEREMAIL, // sender address
        to: user.email, // list of receivers
        subject: "Hello ✔", // Subject line
        text: `please click on the following link 
            ${process.env.BASE_URL}/api/v1/users/verify/${token}
        `
        
      }

      await transporter.sendMail(mailOption)

      res.status(200).json{
        message : "user registered successfully",
        success : true
      }


    } catch (error) {
        res.status(400).json({
            message : "User not registered",
            error,
            success : false


        })
    }
};


const verifyUser = async (req, res) =>{

    const {token} = req.params

    if(!token){
        res.status(200).json({
            message : "invalid token"
        })
    }

    const user = await User.findOne({verificationToken : token})

    if(!user){
        return res.status(400).json({
            message : "invalid token"
        })
   }

   user.isVerified = true
   user.verificationToken = undefined

   await user.save()

}

export {registerUser, verifyUser}