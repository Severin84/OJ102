const express=require('express');
const { login, register, updateSolvedQuestion, getalluser, getUser, logout, getAdmin, updateAdmin } = require('../Controllers/User');
const { verifyJWT } = require('../Middleware/Auth');
const router=express.Router();

router.post("/login",login);
router.post("/register",register)
router.post("/userSolvedQuestion",verifyJWT,updateSolvedQuestion)
router.get("/getallusers",verifyJWT,getalluser);
router.get('/getuser',verifyJWT,getUser)
router.post('/logout',logout)
router.get("/getAdmin",verifyJWT,getAdmin);
router.post("/updateAdmin",verifyJWT,updateAdmin);

module.exports=router