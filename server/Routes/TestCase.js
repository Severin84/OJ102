const express=require('express');
const { createTC, getTC, updateTC, deleteTC, createTestInputAndTestOutput, getInputandOutputTestCases, deleteTestInputAndOutPut } = require('../Controllers/TestCase');
const { verifyJWT } = require('../Middleware/Auth');
const router=express.Router();

router.post("/createTC",verifyJWT,createTC);
router.post("/getTC",verifyJWT,getTC);
router.patch("/updateTC",verifyJWT,updateTC);
router.delete("/deleteTC",verifyJWT,deleteTC)
router.post("/createInputOutputTC",verifyJWT,createTestInputAndTestOutput);
router.post("/getInputOutputTC",verifyJWT,getInputandOutputTestCases);
router.post("/deleteInputOutPutTC",verifyJWT,deleteTestInputAndOutPut)
module.exports=router