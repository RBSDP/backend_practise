
import express from 'express'
import dotenv from "dotenv"
import cookieParser from 'cookie-parser'

// import all routes
import userRoutes from "./routes/user.routes"
import db from './utils/db'

const app = express()
const port = process.env.PORT || 3000

dotenv.config()

app.use(cookieParser())

app.use(
  cors({
    origin : process.env.BASE_URL ,
    credentials : true,
    methods : ["GET" ,"POST", "DELETE", "OPTIONS"],
    allowedHeaders : ["Content-Type", "Authorization"]
  })
)
app.use(express.json())
app.use(express.urlencoded({extended:true}))

db()

// user routes
app.use("/api/v1/users", userRoutes)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/prasad', (req, res) => {
    res.send("prasad")
})
// the below is called as controller, it is calllback function in app.get
// (req, res) => { 
//   res.send("prasad")
// }

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})