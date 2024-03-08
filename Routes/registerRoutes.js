const express=require('express');
const {registercontroller, loginControler, forget_password, resetController } = require('../controller/registerController.js');

// router object
const router=express.Router();

// all APIs
// GET||get all user
router.post('/login',loginControler)

// post||create or signup user
router.post('/register',registercontroller)

// forget 
router.post('/forget-password',forget_password)

// 
router.get('/reset-password',resetController)

module.exports=router;