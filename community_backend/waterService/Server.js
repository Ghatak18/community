const express = require("express")
const cors = require('cors')
const app = express();
const port = 3000;
app.use(express.json());

const corsOptions = {
  origin: '*', // Allow all origins (replace with specific domain in production)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200 // For legacy browser support
};

app.use(cors(corsOptions));

const router = require('./Routes/route1.js')
app.use("/1" ,router);
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})