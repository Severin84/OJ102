const jwt =require("jsonwebtoken");
const {User}=require('../Models/UserModel.js');
const bcrypt=require('bcrypt');
const mongoose=require("mongoose")


const generateAccessAndRefereshToken=async(userID)=>{
  try{
  
     const user=await User.findById(userID);
    
     const accessToken=user.generateAccessToken();
    
     const refreshToken=user.generateRefreshToken();
    
     user.refreshToken=refreshToken;
     await user.save({validateBeforeSave:false})

     return {accessToken,refreshToken};
  }catch(error){
     res.status(500).json({message:"Somthing went wrong while generating refersh token and access Token"})
  }
}


const register=async(req,res,next)=>{
    try{
      const {name,email,password}=await req.body;
      if(!name||!email||!password){
          return res.status(400).json({message:"All details are required"})
      }
      const existingUser=await User.findOne({email});
      
      if(existingUser){
         return res.status(400).json({message:"Email already registered"});
      }
      
      
      const newUser=await User.create({name,email,password});
      
     
     const createdUser=await User.findById(newUser._id).select("-password -refreshToken")
    
     if(!createdUser){
       return res.status(500).json({message:"Something went wrong while registering the user"})
     }
   
      return res.status(200).json({message:"User has been created"})
    }catch(error){
       return res.status(500).json({message:"An error occured while registering the User"})
    }
}

const login=async(req,res,next)=>{
    try{
      const {email,password}=req.body;
      if(!email || !password){
         return res.status(400).json({message:"Both email and password are required"});
      }
      const user=await User.findOne({email});
      if(!user){
        return res.status(400).json({message:"User does not exist"})
      }
      const salt=await bcrypt.genSalt(10);
      const hashedPassword=await bcrypt.hash(password,salt)
     
      const isPasswordVaild=await user.isPasswordCorrect(password);
      
      if(!isPasswordVaild){
        return res.status(401).json({message:"Invalid Email or Password"});
      }
      const {accessToken,refreshToken}=await generateAccessAndRefereshToken(user._id);

      const loggedInUser=await User.findById(user._id).select("-password -refreshToken");

      const finaluser=await User.updateOne({_id:user._id},{refreshToken:refreshToken});
      const getthatuser=await User.findOne({_id:user._id})
      const options={
        httpOnly:true,
        secure:true,
      }     
      return res.status(200).cookie("accessToken",accessToken,options).cookie("refreshToken",refreshToken,options).json({data:getthatuser})
    }catch(error){
       return res.status(500).json({message:'An error occured while logging'})
    }
}

const logout=async(req,res,next)=>{

   res.clearCookie('token');
   res.clearCookie('accessToken');
   res.clearCookie('refreshToken')
   res.status(200).json({message:"User Logged Out"})

}



// const refershAccessToken=async(req,res,next)=>{
//   try{
//      const incomingRefeshToken=req.cookies.refreshTokn||req.body.refreshToken;

//      if(!incomingRefeshToken){
//         return res.status(401).json({message:"unauthorized request"})
//      }

//      const decodedToken=jwt.verify(incomingRefeshToken,process.env.REFRESH_TOKEN_SECRET);

//      const user=await User.findById(decodedToken?._id)

//      if(!user){
//         return res.status(401).json({message:"Invalid refresh token"})
//      }

//      if(incomingRefeshToken!==user?.refreshToken){
//       return res.status(401).json({message:"Refersh token is expired or used"})
//      }

//      const options={
//       httpOnly:true,
//       secure:true
//      }
//      const {accessToken,newRefreshToken}=await generateAccessAndRefereshToken(user._id)

//      return res.status(200).cookies("accessToken",accessToken,options).cookies("refreshToken",newRefreshToken,options).json({message:'Access token refreshed'})
//   }catch(error){
//      return res.status(400).json({message:"something went wrong while refereshing the token"})
//   }
// }



const updateSolvedQuestion=async(req,res,next)=>{
  try{
     const {pid,title,description,difficulty,judgement,Language}=req.body;
     const token=req.header("Authorization")?.replace("Bearer ", "");

     if(!pid||!title||!description||!difficulty||!token||!Language){
        return res.status(400).json({message:'details insufficient'});
     }
      let date=new Date();
   
      let day = date.getDate() <10 ? '0' + date.getDate() : date.getDate();
      let month = (date.getMonth() + 1) <10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1; // Months are zero-based
      let year = date.getFullYear();
      let hours = date.getHours() <10 ?'0'+ date.getHours() : date.getHours();
      let minutes = date.getMinutes() <10 ? '0' + date.getMinutes() : date.getMinutes();
      let currentDate=`${day}/${month}/${year} ${hours}:${minutes}`;

      const decodedToken= jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
      
      const response = await User.updateOne({_id:decodedToken?._id},{$push:{questionSolved:{pid:pid,title:title,description:description,difficulty:difficulty,judgement:judgement,Language:Language,time:currentDate}}});
     if(judgement===true){
       const userdetails=await User.findOne({_id:decodedToken?._id});
       const alreadysolved=userdetails.questionSolved;
       let count=0;
       for(let i=0;i<alreadysolved.length;i++){
           let data=alreadysolved[i];
           if(data.pid===pid){
              count+=1;
           }
       }
       if(count===1){
         const solvedcorrectly=await User.updateOne({_id:decodedToken?._id},{$inc:{numberofquestionsolved:1}});
         return res.status(200).json({message:solvedcorrectly})
       }
         return  res.status(200).json({message:'It wasnnot the new question'}); 
     }
         res.statue(200).json({message:response});
  }catch(error){
      return res.status(400).json({message:"Somthing went wrong while updating solved questions"})
  }
}

const getalluser=async(req,res,next)=>{
  try{
     const users=await User.find();
     const filteredUsers=users.filter((user)=>user.role==='user')
     return res.status(200).json({message:filteredUsers})
  }catch(error){
      return res.status(400).json({message:"something went wrong while getting all users"})
  }
}

const getUser=async(req,res,next)=>{
  try{
     const token=req.header("Authorization")?.replace("Bearer ", "");
     if(!token){
      return res.status(400).json({message:"User not found"});
     }
     const decodedToken= jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
     const user=await User.findById({_id:decodedToken?._id}).select("-password -refreshToken");
     if(!user){
        return res.status(400).json({message:"User does not exist"});
     }
     return res.status(200).json({message:user});
  }catch(error){
     return  res.status(400).json({message:"something went wrong while getting the user"});
  }
}

const getAdmin=async(req,res,next)=>{
    try{
       const admin=await User.findOne({role:"admin"}).select("-refreshToken");
       if(!admin){
          return res.status(401).json({message:"Admin not found"});
       }
       res.status(200).json({message:admin});
    }catch(error){
       return res.status(400).json({message:'something went wrong while getting the admin'})
    }
}

const updateAdmin=async(req,res,next)=>{
   try{
      const {email,password}=req.body;
      const admin=await User.findOne({role:"admin"});
      if(!admin){
         return res.status(401).json({message:"Admin not found"});
      }
      const hashedPass=await bcrypt.hash(password,10)
      const response=await User.updateOne({_id:admin?._id},{email:email,password:hashedPass})

      res.status(200).json({message:response});
   }catch(error){
       return res.status(400).json({message:'something went wrong while updating the admin'})
   }
}
module.exports={
    register,
    login,
    updateSolvedQuestion,
    getalluser,
    getUser,
    logout,
    getAdmin,
    updateAdmin
}