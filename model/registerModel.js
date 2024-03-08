const mongoose = require('mongoose');

const registerSchema = new mongoose.Schema({
    username: String,
    email: { type: String, required: true },
    password: String,
    token: String,
});

const registerModel=mongoose.model('register',registerSchema)

module.exports=registerModel;