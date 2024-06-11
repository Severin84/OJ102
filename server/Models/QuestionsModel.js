const mongoose=require('mongoose');

const QuestionSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    discription:{
        type:String,
        required:true,
    },
    pid:{
        type:Number,
        required:true,
    },
    difficulty:{
        type:Object,
        default:{difficulty:"Easy",color:"#2ad10d"}
    }
},{timestamps:true})

const QuestionsModel=mongoose.model('Questions',QuestionSchema);

module.exports={
    QuestionsModel,
}