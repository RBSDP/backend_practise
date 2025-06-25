import {PrismaClient} from "@prisma/client"
import {bcrypt} from "bcryptjs"
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