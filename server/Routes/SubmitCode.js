const express=require('express');
const { getQuestionData, submitcodeFromFile, solvedQuestion } = require('../Controllers/SubmitCode');
const upload = require('../Middleware/FileUpload.js');
const { verifyJWT } = require('../Middleware/Auth.js');
const router=express.Router();
  

router.post("/submitCode",verifyJWT,getQuestionData)
router.post("/submitupload",upload.single('file'),submitcodeFromFile);
router.post("/updateSolvedQuestion",verifyJWT,solvedQuestion)
module.exports=router