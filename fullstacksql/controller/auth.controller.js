import {PrismaClient} from "@prisma/client"
import {bcrypt} from "bcryptjs"
import {jwt} from "jsonwebtoken"
const prisma = new PrismaClient()

export const registerUser = async (req, res) =>{
    
    const {email, password, name } = req.body;

    if (!email || !password || !name){
        console.log("data is missing")
        return res.status(400).json({
            success: false,
            message : "All feild are required"
        })
    }




    try {
        
        const existingUser = await prisma.user.findUnique({
            where: {email}
        })

        if(!existingUser){
            return res.status(400).json({
            success: false,
            message : "user already exists"
        })}

    } catch (error) {
        
    }
}


export const loginUser = async (req,res) => {

    const {email, password} = req.body

    if(!email || !password){
        return res.status(400).json({
            success: false,
            message : "All feild are required"
    })}


    try {
        
        const user = await prisma.user.findUnique({
            where : {email}
        })

        if(!user){
            return res.status(400).json({
            success: false,
            message : "user not found"
        })}

        const isMatch = bcrypt.compare(password,user.password)

        if(!isMatch){
            return res.status(400).json({
            success: false,
            message : "invalid email or passsword"
        })}

        const token = jwt.sign({
            id:user.id, role :user.role
        }, process.env.JWT_SECRET, {expiresIn : "24h"})

        const cookieOptions = {
            httpOnly : true
        }

        res.cookie("token", token, cookieOptions)
        return res.status(201).json({
            success: true,
            token,
            user : {
                id : user.id,
                name : user.name,
                email : user.email
            },
            message : "invalid email or passsword"
        })



    } catch (error) {
        return res.status(400).json({
            success: false,
            message : "login failed"
        
    })}


}