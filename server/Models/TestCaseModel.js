const mongoose=require('mongoose');


const TestCaseSchema=new mongoose.Schema({
    TestCase:{
        type:Array,
        required:true,
    },
    answers:{
        type:Array,
        required:true
    },
    pid:{
        type:Number,
        required:true,
    }
},{timestamps:true})

const TestCaseModel=mongoose.model('TestCases',TestCaseSchema);

module.exports={
    TestCaseModel,
}