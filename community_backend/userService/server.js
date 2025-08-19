const express  = require('express')
const app = express()
const cors = require('cors')
const cookieParser = require("cookie-parser")
app.use(express.json())
app.use(cookieParser());
port = 3003;

const corsOptions = {
  origin: '*', // Allow all origins (replace with specific domain in production)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200 // For legacy browser support
};

const router = require('./Routes/userRoute1.js')
app.use("/user" ,router);

app.use(cors(corsOptions));
app.listen(port,()=>{
    console.log(`server is running on ${port}`)
})