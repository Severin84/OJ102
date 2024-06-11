const express=require('express');
const { createTC, getTC, updateTC, deleteTC } = require('../Controllers/TestCase');
const { verifyJWT } = require('../Middleware/Auth');
const router=express.Router();

router.post("/createTC",verifyJWT,createTC);
router.post("/getTC",verifyJWT,getTC);
router.patch("/updateTC",verifyJWT,updateTC);
router.delete("/deleteTC",verifyJWT,deleteTC)

module.exports=router