const express=require('express');
const { createQuestions, getQuestion, updateQuestion, deleteQuestion, getQuestions } = require('../Controllers/Question');
const { verifyJWT } = require('../Middleware/Auth');
const router=express.Router();


router.post ("/createQuestion",verifyJWT,createQuestions);
router.get("/getQuestion",verifyJWT,getQuestion);
router.get("/getallQuestions",verifyJWT,getQuestions)
router.patch("/updateQuestion",verifyJWT,updateQuestion);
router.delete("/deleteQuestion",verifyJWT,deleteQuestion)

module.exports=router