const mongoose = require('mongoose');

const connectDB=async()=>{
    try {
        await mongoose.connect(process.env.MongoURL)
        console.log('connected to Mongoose');
    } catch (error) {
        console.log("Mongoose error");
        error;
    }
}

module.exports=connectDB;