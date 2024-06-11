const {cplusExecution,cExecutions,javaExecutions, pythonExecution}=require('../Compiler/compiler.js')
const {generateFile}=require('../Compiler/FileGenerator.js')
const {generateInputFile}=require('../Compiler/generateInputFile.js')
const fs=require('fs')
const path=require('path')

const cCode=async(req,res,next)=>{
    try{
        const {lang,code,input}=req.body;
      //   console.log("lang->"+lang)
      //   console.log('code->'+code)
      //   console.log('input->'+input)
        if(lang==='cpp'){
            try{
               const response=await cplusExecution(code,input);
               res.status(200).json({message:response})
            }catch(error){
               res.status(400).json({message:error})
            }
        }
        else if(lang==='C'){
             try{
               const response=await cExecutions(code,input);
               res.status(200).json({message:response})
             }catch(error){
               res.status(400).json({message:error})
             }
        }else if(lang==='Java'){
             try{
               const response=await javaExecutions(code,input);
               res.status(200).json({message:response})
             }catch(error){
               res.status(400).json({message:error})
             }
        }else{
            try{
               const response=await pythonExecution(code,input);
               res.status(200).json({message:response})
            }catch(error){
               res.status(400).json({message:error})
            }
        }
    }catch(error){
        res.status(400).json({message:"somthing went wrong while complie c code"})
    }
}

const codefromFile=async(req,res,next)=>{
     try{
         const {lang,input}=req.body;
         //  console.log("lang=>"+lang);
         //  console.log("input=>"+input)
         //  console.log("file=>"+req.file)
         const filename=req.file.filename.split("-")[1];
         const codeFile=path.join(__dirname,'uploads',req.file.filename)
         console.log(codeFile)
         const filecontent=fs.readFile(codeFile,{encoding:'utf8'},async function(error,code){
            if(!error && lang==='cpp'){
                  try{
                     const responce=await cplusExecution(code,input,filename);
                     res.status(200).json({message:responce})
                  }catch(error){
                     res.status(400).json({message:error})
                  }
               }else if(!error && lang==='C'){
                  try{
                     const response=await cExecutions(code,input,filename);
                     res.status(200).json({message:response})
                  }catch(error){
                     res.status(400).json({message:error})
                  }
               }else if(!error && lang==='Java'){
                  try{
                     const response=await javaExecutions(code,input,filename);
                     res.status(200).json({message:response})
                   }catch(error){
                     res.status(400).json({message:error})
                   }
               }else if(!error && lang==='python'){
                  try{
                     const response=await pythonExecution(code,input,filename);
                     res.status(200).json({message:response})
                  }catch(error){
                     res.status(400).json({message:error})
                  }
               }else if(error){
                  console.log(error)
               }else{
                  console.log("!OOPS")
               }
               fs.unlinkSync(codeFile);
         }
      )
     }catch(error){
      res.status(400).json({message:"somthing went wrong while complie code from file"})
     }
}


module.exports={
    cCode,codefromFile
}