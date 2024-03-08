const express=require('express')
// const colors = require('colors');
const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB=require ('./config/connectDB')

// env configure
dotenv.config()

// importin routes
const registerRoute=require('./Routes/registerRoutes.js')


connectDB();
const app=express();


// middleware
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

// routes
app.use("/",registerRoute);

const PORT=process.env.PORT || 8080
app.listen(8080,()=>{
    console.log('server running on port 8080');
})