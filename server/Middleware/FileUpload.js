const fs=require('fs');
const multer=require('multer');
const uploadDirectory='./uploads';
const path=require('path')
const storage=multer.diskStorage({
    
    destination:(req,file,cb)=>{

       cb(null,'Controllers/uploads')
    },
    
    filename:(req,file,cb)=>{
    cb(null,Date.now()+'-'+file.originalname);
    }
})


const upload=multer({storage:storage})

module.exports=upload
      
