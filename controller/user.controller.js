import User from "../model/User.model";
import nodemailer from "nodemailer"
import crypto from 'crypto'
import jwt from "jsonwebtoken"

import bcrypt from "bcrypt"

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

      res.status(200).json({
        message : "user registered successfully",
        success : true
      })


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


const login = async (req,res) => {
    const {email, password } = req.body

    if(!email || !password){
        res.status(200).json({
            message : "all feilds are needed"
        })
    }

    try {
        const user = await User.findOne({email})

        if(!user){
            res.status(200).json({
                message : "user not found"
            })
        }

        const isMatch = bcrypt.compare(password, user.password)
        if(!isMatch){
            res.status(200).json({
                message : "username or password incorrect"
            })
        }

        const token = jwt.sign({
            id: user._id,
            email : user.email
        }, "shhhh", {expiresIn : '24h'})


        const cookieOptions = {
            httpOnly : true,
            secure : true,
            maxAge : 24*60*60*1000

        }

        res.cookie("token", token, cookieOptions)

        res.send(200).json({
            message : 'login sucessfull',
            token,
            user : {
                id : user._id,
                name: user.name,
                role:user.role
            }

        })



        
    } catch (error) {
        res.status(400).json({
            message : "invalid request",
            error
        })
    }
    
}

const getMe = async (req,res) => {

    try {

        const user = User.findById(req.user.id).select('-password')
        if(!user){
            return res.status(200).json({
                message : "user not found"
            })
        }
        
        res.status(200).json({
            success : true,
            user
        })
    } catch (error) { 

        res.status(400).json({
            message : "invalid request",
            error
        })
        
    }

}


const logoutUser = async (req,res) => {

    try {
        // by clearing the cookie we can logout user
        res.cookie('token', '', ) 
        res.status(200).json({
            success : true,
            message: "logged out successfully"
            
        })


        
    } catch (error) {
        res.status(400).json({
            message : "invalid request",
            error
        })
        
    }

}

const forgotPassword = async (req,res) => {

    try {

        const {email} = req.body 
        const user = await User.findOne({email})

        const token = crypto.randomBytes(32).toString('hex')
        console.log(token)
        user.resetPasswordToken = token
        user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
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
            ${process.env.BASE_URL}/api/v1/users/resetPassword/${token}
        `
        
      }

      await transporter.sendMail(mailOption)
        
    } catch (error) {
        
    }

}

const resetPassword = async (req,res) => {

    try {
        const {token} = req.params
        const {password} = req.body

        try {
            const user = await User.findOne({
                resetPasswordToken : token,
                resetPasswordExpires : {$gt : Date.now()}

            })

            user.password = password
            user.resetPasswordToken = undefined
            user.resetPasswordExpires = undefined

            await user.save()


        } catch (error) {
            
        }

    } catch (error) {
        
    }

}


export {registerUser, verifyUser, login, getMe, logoutUser, forgotPassword, resetPassword }