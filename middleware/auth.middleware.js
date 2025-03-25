
import jwt from "jsonwebtoken"


export const isLoggedIn = async (req , res ,next) => {

    try {
        const token = req.cookies?.token

        if (!token){
            return res.status(400).json({
                success : false,
                message : "unauthorised acess, token not found"

            })
        }

        console.log(token)

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        console.log(decoded)

        req.user = decoded

        

        next()
    } catch (error) {

        return res.status(500).json({
            success : false,
            message : "internal server error" })
        
    }

}