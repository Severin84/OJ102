const mongoose=require('mongoose');
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum:['user','admin'],
        default:'user',
    },
    refreshToken:{
        type:String,
    },
    questionSolved:[
        {
            pid:{type:Number,required:true},
            title:{type:String,required:true},
            description:{type:String,required:true},
            difficulty:{type:Object,required:true},
            judgement:{type:Boolean,required:true},
            Language:{type:String,required:true},
            time:{type:String,default:Date.now(),required:true},
        },
        
    ],
    numberofquestionsolved:{
        type:Number,
        default:0,
        required:true,
    },

},{timestamps:true});


userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        return next();
    }

    this.password=await bcrypt.hash(this.password,10)
    next();
})

userSchema.methods.isPasswordCorrect=async function(password){
    return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken=function(){
    return jwt.sign(
        {
           _id:this._id,
           email:this.email,
           name:this.name,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}


userSchema.methods.generateRefreshToken=function(){
    return jwt.sign(
        {
            _id:this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}
 


const User=mongoose.model('User',userSchema);

module.exports={
    User
}
