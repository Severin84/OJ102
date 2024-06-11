const TC=require("../Models/TestCaseModel.js");
const QuestionModel=require("../Models/QuestionsModel.js")

const createTC=async(req,res,next)=>{
   try{
     const {TestCase,answers,pid}=req.body;
     if(!TestCase||!answers||!pid){
        return res.status(400).json({message:"Please enter all details"});
     }
     const quest=await QuestionModel.QuestionsModel.findOne({pid:pid});
     if(!quest){
        return res.status(400).json({message:"the pid is wrong"});
     }
     const response=await TC.TestCaseModel({TestCase:TestCase,answers:answers,pid:pid});
     await response.save();
     res.status(200).json({message:response});
   }catch(error){
    res.status(500).json({message:"Somthing went wrong while creating the test cases"})
   }
}

const getTC=async(req,res,next)=>{
  try{
    const {pid}=req.body;
    if(!pid){
        return res.status(400).json({message:"Please provide the id"});
    }
    const testcase=await TC.TestCaseModel.find({pid:pid});
    if(!testcase){
        return res.status(400).json({message:"This test case does not exist"});
    }
    res.status(200).json({message:testcase});
  }catch(error){
    res.status(500).json({message:"Somthing went wrong while getting the test case"})
  }
}

const updateTC=async(req,res,next)=>{
    try{
    const {TestCase,answers,pid}=req.body;
    if(!pid){
        return res.status(400).json({message:"Please provide the id"});
    }
    const testcase=await TC.TestCaseModel.findOne({pid:pid});
    if(!testcase){
        return res.status(400).json({message:"This test case does not exist"});
    }
    if(TestCase){
        const response=await TC.TestCaseModel.updateOne({pid:pid},{$set:{TestCase:TestCase}})
        res.status(200).json({message:response});
    }
    if(answers){
        const response=await TC.TestCaseModel.updateOne({pid:pid},{$set:{answers:answers}})
        res.status(200).json({message:response});
    }

    }catch(error){
        res.status(500).json({message:'Somthing went wrong while updating the test case'})
    }
}


const deleteTC=async(req,res,next)=>{
    try{
       const {pid}=req.body;
       if(!pid){
         return res.status(400).json({message:"please provide the ID"});
       }
       const testcase=await TC.TestCaseModel.findOne({pid:pid});
       if(!testcase){
          return res.status(400).json({message:"this testcase does not exist"});
       }
       const response=await TC.TestCaseModel.deleteOne({pid:pid});
       res.status(200).json({message:response});
    }catch(error){
        res.status(500).json({message:'Somthing went wrong while deleting the test case'})
    }
}
module.exports={
    createTC,
    getTC,
    updateTC,
    deleteTC
}