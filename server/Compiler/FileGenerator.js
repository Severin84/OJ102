const fs=require('fs');
const path=require('path');
const {v4:uuid}=require('uuid');


const dirCodes=path.join(__dirname,'codes');

if(!fs.existsSync(dirCodes)){
    fs.mkdirSync(dirCodes,{recursive:true});
}

const generateFile=async(format,content)=>{
    if(format==='Java'){
        const fileName='test'
        //const jobID=uuid();
        const filename=`${fileName}.java`;
        const filePath=path.join(dirCodes,filename);
        await fs.writeFileSync(filePath,content);
        return filename
    }else{
        //const fileName='test'
        const jobID=uuid();
        const filename=`${jobID}.${format}`;
        const filePath=path.join(dirCodes,filename);
        console.log(filePath)
        await fs.writeFileSync(filePath,content);
        return filePath;
    }
   
}

module.exports={
    generateFile,
}

