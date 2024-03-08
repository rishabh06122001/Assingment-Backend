const registerModel = require('../model/registerModel')
const signupModel=require('../model/registerModel')
const bcrypt=require('bcrypt')
const nodemailer=require("nodemailer");
const nodemon = require('nodemon');
const randomstring = require('randomstring');
const config =require('../config/config')

// resetpassword mail
const sendresetpasswordmail = async (email, token) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: config.emailUser,
                pass: config.emailPassword
            },
            tls: {
                rejectUnauthorized: false // This line disables certificate validation
            }
        });

        // custom message
        const mailOptions = {
            from: config.emailUser,
            to: email,
            subject: 'For Reset Password',
            html: '<p> Please copy the link and<a href="http://localhost:8080/reset-password?token=' + token + '"> reset your password <a/>'
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Mail has been sent:", info.response);
        return { success: true, msg: "Mail has been sent" };
    } catch (error) {
        console.error("Error sending mail:", error);
        return { success: false, msg: error.message };
    }
};


// securepassword creation or hashing password function
const securepassword=async(password)=>{
    try {
       const passwordHash=await bcrypt.hash(password,10);
       return passwordHash; 
    } catch (error) {
        res.status(400).send(error.message);
    }
}

// login 
exports.loginControler=async(req,res)=>{
    try {
        const{username,password}=req.body
        if(!username||!password){
            res.status(401).send({
                success:false,
                message:"Please provide email or password"
            })
        }
        const user=await registerModel.findOne({username})
        if(!user){
            res.status(401).send({
                success:false,
                message:"Email is not match"
            })
        }
        const passwordMatch=await bcrypt.compare(password,user.password)
        if(!passwordMatch){
            res.status(401).send({
                success:false,
                message:"Password is not wrong"
            })
        }
        return res.status(200).send({
            success:true,
            message:"Login sucesssfully",
            user,
        })
    } catch (error) {
        return res.status(404).send({
            success:false,
            messsage:"Error in login",
            error
        })
    }
}

// creating a register
exports.registercontroller=async(req,res)=>{
    try {
        const{username,email,password}=req.body
        if(!username||!email||!password){
            return res.status(404).send({
                success:false,
                message:'Please fill all fields'
            })
        }

        // already user hai
        const existingUser=await signupModel.findOne({email})
        if(existingUser){
            return res.status(404).send({
                success:false,
                message:"email is already used"
            })
        }

        // hashing the password
        const hashpassword=await bcrypt.hash(password,10)

        // saving the new user
        const user=new signupModel({username,email,password:hashpassword})
        await user.save()
        return res.status(201).send({
            success:true,             
            message:"new user created",
            user
        })
        
    } catch (error) {
        return res.status(404).send({
            message:"Error in Register callback",
            success:false,
            error
        })
    }
}

// forgot password
exports.forget_password=async(req,res)=>{
    try {
        const email=req.body.email;
        console.log('Email:', email);
        const userData=await registerModel.findOne({email:email});
        
        if(userData){
            const token=randomstring.generate();
            const updateResult = await registerModel.findOneAndUpdate(
                { email: email }, 
                { $set: { token: token } },
                { new: true }
            );
            console.log(updateResult);
            await sendresetpasswordmail(userData.email,token)
            res.status(200).send({success:true,msg:"Please check your inbox of mail and reset your password"})
            console.log(email, token)
        }
        else{
            res.status(200).send({success:true,msg:"This email does not exists."})
        }     
    } catch (error) {
        res.status(400).send({success:false,msg:error.message})
    }
}


exports.resetController=async(req,res)=>{
    try {
        const tokenVerification=req.query.token
        const tokenData=await registerModel.findOne({token:tokenVerification})
        if(tokenData){
            const password=req.body.password;
            const newpassword=await securepassword(password);
            // with the help of id we can update password
            const userData=await registerModel.findByIdAndUpdate({_id:tokenData._id},{$set:{password:newpassword,token:''}},{new:true});
            res.status(200).send({success:true,msg:"User password has been reset",data:userData})
        }
        else{
            res.status(200).send({success:true,msg:"Thsi token is wrong"})
        }
    } catch (error) {
        res.status(400).send({success:false,msg:error.message})
    }
}