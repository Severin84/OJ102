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
      
      const existingUser=await User.findOne({email});
      
      if(existingUser){
         return res.status(400).json({message:"Email already registered"});
      }
      
      const salt=await bcrypt.genSalt(10);
      const hashedPassword=await bcrypt.hash(password,salt);
      
      const newUser=new User({name,email,password:hashedPassword});
      await newUser.save();
     
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
      const isPasswordVaild=bcrypt.compare(user.password,hashedPassword);
      if(!isPasswordVaild){
        return res.status(400).json({message:"Invalid Email or Password"});
      }
      const {accessToken,refreshToken}=await generateAccessAndRefereshToken(user._id);
      const loggedInUser=await User.findById(user._id).select("-password -refreshToken")
      const options={
        httpOnly:true,
        secure:true,
      }     
      return res.status(200).cookie("accessToken",accessToken,options).cookie("refreshToken",refreshToken,options).json({data:user})
    }catch(error){
       return res.status(500).json({message:'An error occured while logging'})
    }
}

const logout=async(req,res,next)=>{
  await User.findByIdAndUpdate(req.user._id,{
    $unset:{
             refreshToken:1
           },
    },
    {
      new:true
    }
  )

  const options={
      httpOnly:true,
      secure:true
  }

  return res.status(200).clearCookie("accessToken",options).clearCookies("refershToken",options).json({message:"User Logged Out"})
}

const refershAccessToken=async(req,res,next)=>{
  try{
     const incomingRefeshToken=req.cookies.refreshTokn||req.body.refreshToken;

     if(!incomingRefeshToken){
        return res.status(401).json({message:"unauthorized request"})
     }

     const decodedToken=jwt.verify(incomingRefeshToken,process.env.REFRESH_TOKEN_SECRET);

     const user=await User.findById(decodedToken?._id)

     if(!user){
        return res.status(401).json({message:"Invalid refresh token"})
     }

     if(incomingRefeshToken!==user?.refreshToken){
      return res.status(401).json({message:"Refersh token is expired or used"})
     }

     const options={
      httpOnly:true,
      secure:true
     }

     const {accessToken,newRefreshToken}=await generateAccessAndRefereshToken(user._id)

     return res.status(200).cookies("accessToken",accessToken,options).cookies("refreshToken",newRefreshToken,options).json({message:'Access token refreshed'})
  }catch(error){
     res.status(400).json({message:"something went wrong while refereshing the token"})
  }
}

// const changeCurrentPassword=async(req,res,next)=>{
//   try{
//         const {oldPassword,newPassword}=req.body;

//         const user=await
//   }catch(error){
//      return res.status(400).json({message:"Something went wrong while updating the password"})
//   }
// }
// const forgotPassword=async(req,res,next)=>{
//     try{
//         const {email}=req.body;
//         const user=await User.UserModel.findOne({email});
//         if(!user){
//             return res.status(404).json({message:"User not found"});
//         }

//         const resetToken=crypto.randomBytes(20).toString('hex');
//         user.t
//     }
// }

const updateSolvedQuestion=async()=>{
  try{
     const {Question}=req.body;
     if(!Question){
       return res.status(400).json({message:'Question is required'});
     }
     
  }catch(error){
     return res.status(400).json({message:"Somthing went wrong while updating solved questions"})
  }
}
module.exports={
    register,login
}