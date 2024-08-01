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

const createTestInputAndTestOutput=async(req,res,next)=>{
   try{
        const {TestInput,pid,TestOutput}=req.body;
        if(!TestInput||!pid||!TestOutput){
             return res.status(401).json({message:"TestInput,pid and Testoutput required"})
        }

        const Testresponse=await TC.TestCaseModel.updateOne({pid:pid},{$push:{TestInput:TestInput}});
        if(!Testresponse){
            return res.status(401).json({message:"Something went wrong while insering TestInput"})
        }
        const TestresponseOutput=await TC.TestCaseModel.updateOne({pid:pid},{$push:{TestOutput:TestOutput}});
        if(!TestresponseOutput){
            return res.status(401).json({message:"Something went wrong while insering TestOutput"})
        }

        res.status(200).json({message:"Input And Output TestCases Inserted"});
   }catch(error){
      res.status(400).json({message:"Something went wrong while adding Input and Output TestCases"})
   }
}

const getInputandOutputTestCases=async(req,res,next)=>{
   try{
      const {pid}=req.body;
      if(!pid){
        return res.status(401).json({message:"Pid isrequired"});
      }
      console.log(pid)
      const data=await TC.TestCaseModel.findOne({pid:pid});
      if(!data){
         return res.status(401).json({message:"Invalid PID"});
      }

      return res.status(200).json({message:data});
   }catch(error){
      res.status(400).json({message:"Something went wrong while getting Input and Output TestCases"})
   }
}
const deleteTestInputAndOutPut=async(req,res,next)=>{
   try{
      const {pid,input,output}=req.body;
      if(pid===undefined||input===undefined||output===undefined){
        return res.status(401).json({message:"Pid required"})
      }
      // console.log("2->2")
      const currentTestData=await TC.TestCaseModel.findOne({pid:pid});
      if(!currentTestData){
        return res.status(401).json({message:"Invalid PID"});
      }
     
      const TestInputData=currentTestData.TestInput;
      
      const TestOutputData=currentTestData.TestOutput;

      const deletedInputData=TestInputData.filter((ele,idx)=>idx!==input);
    
      const deletedOutputData=TestOutputData.filter((ele,idx)=>idx!==output);
      
      const updateData=await TC.TestCaseModel.updateOne({pid:pid},{TestInput:deletedInputData,TestOutput:deletedOutputData});

      res.status(200).json({message:"Test Case Deleted"})
   }catch(error){
     res.status(400).json({message:"Something went worng while deleting Input and output test case"})
   }
}


module.exports={
    createTC,
    getTC,
    updateTC,
    deleteTC,
    createTestInputAndTestOutput,
    deleteTestInputAndOutPut,
    getInputandOutputTestCases
}