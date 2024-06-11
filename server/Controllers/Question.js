const  QuestionsModel=require("../Models/QuestionsModel.js")

const createQuestions=async(req,res,next)=>{
  try{
    const {title,discription,pid,difficulty}=req.body;
    if(!title||!discription||!pid){
        return res.status(400).json({message:"please fill all the details"});
    }
    const quest=await QuestionsModel.QuestionsModel.findOne({title});
    if(quest){
        return res.status(400).json({message:"Question already exist"});
    }
    const response=await QuestionsModel.QuestionsModel({title:title,discription:discription,pid:pid,difficulty:difficulty})
    await response.save();
    res.status(200).json({message:"Qestion has been created"})
  }catch(error){
    res.status(500).json({message:"Somthing went wrong while creating the question"})
  }
}

const getQuestion=async(req,res,next)=>{
   try{
      const {title}=req.body;
      if(!title){
         return res.status(400).json({message:"the question does not exist by this title"})
      }
      const quest=await QuestionsModel.QuestionsModel.find({title});
      if(!quest){
         return res.status(400).json({message:"This question does not exist"});
      }
      res.status(200).json({data:quest});
   }catch(error){
    res.status(500).json({message:"Somthing went wrong while getting the question"})
   }
}

const getQuestions=async(req,res,next)=>{
    try{
      const quest=await QuestionsModel.QuestionsModel.find();
      res.status(200).json({data:quest})
    }catch(error){
        res.status(500).json({message:"Somthing went wrong while getting all questions"})
    }
}

const updateQuestion=async(req,res,next)=>{
    try{
      const {title,discription,pid}=req.body;
      if(!discription){
        return res.status(400).json({message:"Please enter teh content to update"})
      }
      const quest=await QuestionsModel.QuestionsModel.findOne({title});
      if(!quest){
        return res.status(400).json({message:"This question does not exist"});
      }
      
      const response=await QuestionsModel.QuestionsModel.updateOne({title:title},{$set:{discription:discription}})
      //console.log("KKK")
      res.status(200).json({message:response});
    }catch(error){
        res.status(500).json({message:"Somthing went wrong while updateing the question"})
    }
}

const deleteQuestion=async(req,res,next)=>{
  try{
    const {title}=req.body;
    if(!title){
        return res.status(400).json({message:"please tell which question to be deleted"})
    }
    const quest=await QuestionsModel.QuestionsModel.findOne({title});
    if(!quest){
        return res.status(400).json({message:"No Such question exist"});
    }
   
    const response=await QuestionsModel.QuestionsModel.deleteOne({title:title});
    res.status(200).json({message:response})
  }catch(error){
    res.status(500).json({message:"Somthing went wrong while Deleting the question"})
  }
}
module.exports={
    createQuestions,
    getQuestion,
    updateQuestion,
    deleteQuestion,
    getQuestions
}