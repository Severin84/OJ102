const express=require('express');
const {cCode,codefromFile}=require("../Controllers/Compiler.js");
const upload = require('../Middleware/FileUpload.js');
const { verifyJWT } = require('../Middleware/Auth.js');
const router=express.Router();

router.post('/compile',verifyJWT,cCode)
router.post('/upload',verifyJWT,upload.single('file'),codefromFile);
module.exports=router