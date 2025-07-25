import express from "express"
import { registerUser, verifyUser,login, getMe, logoutUser, forgotPassword, resetPassword } from "../controller/user.controller"
import isLoggedIn from "../middleware/auth.middleware.js"
const router = express.Router() 

router.post("/register",registerUser)
router.get("/verify/:token",verifyUser)
router.post("/login",login)
router.get("/me",isLoggedIn, verifyUser)
router.get("/logoutUser",isLoggedIn, logoutUser)
router.get("/forgotPassword",forgotPassword)
router.get("/resetPassword/:token",resetPassword)



export default router;
