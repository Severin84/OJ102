const { javaExecutions, cplusExecution, cExecutions, pythonExecution } = require("../Compiler/compiler.js");
const QuestionModel=require("../Models/QuestionsModel.js")
const TestCaseModel=require("../Models/TestCaseModel.js");
const fs=require('fs')
const path=require('path');
const { User } = require("../Models/UserModel.js");
const { getMaxListeners } = require("stream");

const getQuestionData=async(req,res,next)=>{
   try{
      const {lang,code,pid}=req.body;
      if(!lang||!code||!pid){
        return res.status(401).json({message:"Both language and code are required"});
      }
      const testData=await TestCaseModel.TestCaseModel.findOne({pid:pid})
      const input2=testData?.TestInput;
      const inputString2=testData?.TestOutput
      if(lang==='cpp'){
         try{
            let resultArray=[];
            async function queue(input2){
               for(const item of input2){
                  try{
                     const result =await cplusExecution(code,item);
                     resultArray.push(result)
                  }catch(error){
                     console.log("submittion error"+error)
                     res.status(400).json({message:error})
                  }
               }
               res.status(200).json({message:resultArray,answers:inputString2})
            }
            queue(input2)
         }catch(error){
            res.status(400).json({message:error})
         }
      }
      else if(lang==='C'){
         try{
            let resultArray=[];
            async function queue(input2){
               for(const item of input2){
                  try{
                     const result =await cExecutions(code,item);
                     resultArray.push(result)
                  }catch(error){
                     console.log("submittion error"+error)
                     res.status(400).json({message:error})
                  }
               }
               res.status(200).json({message:resultArray,answers:inputString2})
            }
            queue(input2)
         }catch(error){
            res.status(400).json({message:error})
         }
      }
      else if(lang==='Java'){
         try{
            let resultArray=[];
            async function queue(input2){
               for(const item of input2){
                  try{
                     const result =await javaExecutions(code,item);
                     resultArray.push(result)
                  }catch(error){
                     console.log("submittion error"+error);
                     res.status(400).json({message:error})
                  }
               }
               res.status(200).json({message:resultArray,answers:inputString2})
            }
             queue(input2)
         }catch(error){
            res.status(400).json({message:error})
         }
      }
      else {
         try{
            let resultArray=[];
            async function queue(input2){
               for(const item of input2){
                  try{
                     const result =await pythonExecution(code,item);
                     resultArray.push(result)
                  }catch(error){
                     console.log("submittion error"+error)
                     res.status(400).json({message:error})
                  }
               }
               res.status(200).json({message:resultArray,answers:inputString2})
            }
            queue(input2)
         }catch(error){
            res.status(400).json({message:error})
         }
      }
   }catch(error){
    console.log(error)
    res.status(400).json({message:error})
   }
}

const submitcodeFromFile=async(req,res,next)=>{
   try{
      const {lang,pid}=req.body;
      if(!lang||!pid){
        return res.status(401).json({message:"Both language and file are required"});
      }
      const fileName=req.file.filename.split("-")[1];
      const codeFile=path.join(__dirname,'uploads',req.file.filename)
      const testData=await TestCaseModel.TestCaseModel.findOne({pid:pid})
      const input2=testData?.TestInput
      const inputString2=testData?.TestOutput;
      const filecontent=fs.readFile(codeFile,{encoding:'utf8'}, async function(error,code){
         if(!error && lang==='cpp'){
            try{
               let resultArray=[];
               async function queue(input2){
                  for(const item of input2){
                     try{
                        const result =await cplusExecution(code,item,fileName);
                        resultArray.push(result)
                     }catch(error){
                        console.log("submittion error"+error);
                        res.status(400).json({message:error})
                     }
                  }
                  res.status(200).json({message:resultArray,answers:inputString2})
               }
               queue(input2)
            }catch(error){
               res.status(400).json({message:error})
            }
         }
         else if(!error && lang==='C'){
            try{
               let resultArray=[];
               async function queue(input2){
                  for(const item of input2){
                     try{
                        const result =await cExecutions(code,item,fileName);
                        resultArray.push(result)
                     }catch(error){
                        console.log("submittion error"+error);
                        res.status(400).json({message:error})
                     }
                  }
                  res.status(200).json({message:resultArray,answers:inputString2})
               }
               queue(input2)
            }catch(error){
               res.status(400).json({message:error})
            }
         }
         else if(!error && lang==='Java'){
            try{
               let resultArray=[];
               async function queue(input2){
                  for(const item of input2){
                     try{
                        const result =await javaExecutions(code,item,fileName);
                        resultArray.push(result)
                     }catch(error){
                        console.log("submittion error"+error);
                        res.status(400).json({message:error})
                     }
                  }
                  res.status(200).json({message:resultArray,answers:inputString2})
               }
               queue(input2)
            }catch(error){
               res.status(400).json({message:error})
            }
         }
         else if(!error && lang==='python'){
            try{
               let resultArray=[];
               async function queue(input2){
                  for(const item of input2){
                     try{
                        const result =await pythonExecution(code,item,fileName);
                        resultArray.push(result)
                     }catch(error){
                        console.log("submittion error"+error);
                        res.status(400).json({message:error})
                     }
                  }
                  res.status(200).json({message:resultArray,answers:inputString2})
               }
               queue(input2)
            }catch(error){
               res.status(400).json({message:error})
            }
         }else if(error){
            console.log(error)
            
         }else{
            console.log("sub !OOPS")
         }
         fs.unlinkSync(codeFile);
      })
   }catch(error){
      res.status(400).json({message:"Somthing went wrong while submiting code from file"})
   }
}
const solvedQuestion=async(req,res,next)=>{
    try{
        const {question}=req?.body;
        const token=req.header("Authorization")?.replace("Bearer ", "");
        if(!question||!token){
            return res.status(401).json({message:"Insufficient data"});
        }
         const decodedToken= jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
         const user=await User.findOne({_id:decodedToken?._id})
        const response=await User.findOneAndUpdate(user._id,{$push:{questionSolved:question}});
    }catch(error){
       return res.status(400).json({message:"Somthing went wrong while upddating solved questions"})
    }
}
module.exports={
    getQuestionData,submitcodeFromFile,solvedQuestion
}