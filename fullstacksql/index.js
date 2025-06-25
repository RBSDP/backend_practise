import express, { urlencoded } from "express"

import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"
import userRouter from "./routes/auth.route"

dotenv.config()

const app = express()
const port = process.env.PORT|| 4000
app.use(cookieParser())
app.use(urlencoded({extended:true}))
app.cors({
    origin : "https://localhost:5173"
})


// custom routes

app.use('/api/v1/users',userRouter);



app.get('/', (req, res) => { 
    res.status(200).json({
        
        success : true,
        message : "text route"}

    )
})


app.listen(port, () => {
    console.log(`server is running on ${port}`)
})