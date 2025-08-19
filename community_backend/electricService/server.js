const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json());

port = 3002;

const corsOptions = {
  origin: '*', // Allow all origins (replace with specific domain in production)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200 // For legacy browser support
};

app.use(cors(corsOptions));

const router = require('./Routes/1.js')
app.use("/3" ,router);

app.listen(port,()=>{
    console.log(`server 3 is running on ${port}`);
})