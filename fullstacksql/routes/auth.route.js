import express from "express"
import { registerUser } from "../controller/auth.controller"

const userRouter = express.Router()

userRouter.post('/register',registerUser)

export default userRouter