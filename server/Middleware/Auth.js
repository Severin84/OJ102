const jwt =require('jsonwebtoken');
const {User} = require('../Models/UserModel');

const verifyJWT=async(req,res,next)=>{
  try{
      const token=req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
      // console.log("V");
      // console.log(token);
      // console.log("^")

      if(token===undefined){
        return res.status(401).json({message:"Unauthorized request"})
      }

      const decodedToken= jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
      //console.log(decodedToken)
      const user=await User.findById(decodedToken?._id).select("-password -refreshToken");

      if(!user){
         return res.status(401).json({message:"Invalid Access Token"})
      }

      req.user=user;
      next();
  }catch(error){
    return res.status(401).json({message:"Invalid access token"})
  }
}

const authenticateUser=(req,res,next)=>{
    try{
      const token =req.headers.authorization.split(' ')[1];

      const decodedToken=jwt.verify(token,'secretKey');

      req.userId=decodedToken.userId;

      next();
    }catch(error){
        res.status(401).json({message:"Unauthorized"})
    }
}


const authorizeUser=(requiredRole)=>async(req,res,next)=>{
  try{
    const user=await UserModel.findById(req.userId);
    if(user.role!==requiredRole){
        return res.status(403).json({error:"Forbidden"});
    }

    next();
  }catch(error){
     res.status(500).json({message:"An error occurred while authorizing the user"})
  }
}


module.exports={
    authenticateUser,
    authorizeUser,
    verifyJWT
}