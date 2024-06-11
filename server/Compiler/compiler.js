const fs=require('fs');
const {exec,spawn}=require('child_process');
const path=require('path');
const { stdout, stderr } = require('process');
const util = require("util")
const pe=require('pe-parser')
const writeFileAsync = util.promisify(fs.writeFile);
const express=require('express');
const os=require('os');
const { error } = require('console');
const { rejects } = require('assert');

const outputPath=path.join(__dirname,"outputs");

if(!fs.existsSync(outputPath)){
    fs.mkdirSync(outputPath,{recursive:true})
}

const saveFile=async (name,data)=>{
    try{
     await writeFileAsync(name,data); 
    console.log("file has been saved!"); 
    }catch(error){
        console.log("somthing went wrong")
        return;
    }
}


const cplusExecution=async (data,input,filename)=>{
    try{
      return new Promise(async(resolve,reject)=>{
        const fileName=filename || 'test.cpp';

        const inputfilename="input.txt";

        const sourcePath=path.join(__dirname,fileName);
        const executablePath=path.join(__dirname,"CPP.out")
        const inputFilePath=path.join(__dirname,inputfilename);

        await saveFile(sourcePath,data)
           
        fs.writeFileSync(inputFilePath,input,function(error){
            if(error){
                console.log(error);
                return;
            }
        })

        const compile = spawn('g++', [sourcePath, '-o', executablePath]);

        compile.on('close',(code)=>{
            if(code===0){
                console.log("compilation successful");


                const run=spawn(executablePath);

                const inputStream=fs.createReadStream(inputFilePath);

                inputStream.pipe(run.stdin);

                run.stdout.on('data',(data)=>{
                    console.log(`Output:${data}`);
                  
                    resolve(data)
                })
                

                run.stderr.on('data',(data)=>{
                    console.error(`Error: ${data}`)
                   
                    reject(data)
                })

                run.on('close',(code)=>{
                    console.log(`Java program exited with code ${code}`)
                })
            }else{
                console.log(`Compilation failed with exit code; ${code}`)
            }
        })
        // fs.unlinkSync(inputFilePath)
        // fs.unlinkSync(sourcePath)
      })
    }catch(error){
        console.log("C++: "+ error)
    }
}



const cExecutions =async(data,input,filename)=>{
     try{
        return new Promise(async(resolve,reject)=>{
            const fileName=filename || 'test.c';

            const inputfilename="input.txt";

            const sourcePath=path.join(__dirname,fileName);
            const executablePath=path.join(__dirname,"C.out")
            const inputFilePath=path.join(__dirname,inputfilename);

            await saveFile(sourcePath,data)
           
            fs.writeFileSync(inputFilePath,input,function(error){
                if(error){
                    console.log(error);
                    return;
                }
            })

            const compile = spawn('gcc', [sourcePath, '-o', executablePath]);

            compile.on('close',(code)=>{
                if(code===0){
                    console.log("compilation successful");


                    const run=spawn(executablePath);

                    const inputStream=fs.createReadStream(inputFilePath);

                    inputStream.pipe(run.stdin);

                    run.stdout.on('data',(data)=>{
                        console.log(`Output:${data}`);
                      
                        resolve(data)
                    })
                    

                    run.stderr.on('data',(data)=>{
                        console.error(`Error: ${data}`)
                       
                        reject(data)
                    })

                    run.on('close',(code)=>{
                        console.log(`Java program exited with code ${code}`)
                    })
                }else{
                    console.log(`Compilation failed with exit code; ${code}`)
                }
            })
            // fs.unlinkSync(inputFilePath)
            // fs.unlinkSync(sourcePath)
        })
     }catch(error){
        console.log("cE"+error)
     }
}

const javaExecutions=async(data,input,filename)=>{

   try{
         return new Promise(async(resolve,reject)=>{
          
            const fileName=filename || 'test.java';

            const inputfilename="input.txt";

            const sourcePath=path.join(__dirname,fileName);
            const outputPath=__dirname;
            const inputFilePath=path.join(__dirname,inputfilename);

            await saveFile(sourcePath,data)
           
            fs.writeFileSync(inputFilePath,input,function(error){
                if(error){
                    console.log(error);
                    return;
                }
            })
    
            const compile=spawn('javac',[sourcePath]);

            compile.on('close',(code)=>{
                if(code===0){
                    console.log("compilation successful");

                    const className=path.basename(sourcePath,'.java');

                    const run=spawn('java',['-cp',outputPath,className]);

                    const inputStream=fs.createReadStream(inputFilePath);

                    inputStream.pipe(run.stdin);

                    run.stdout.on('data',(data)=>{
                        console.log(`Output:${data}`);
                      
                        resolve(data)
                    })
                    
                    run.stdout.on('data',(data)=>{
                        console.log(`output:${data}`)
                     
                       resolve(data)
                    })

                    run.stderr.on('data',(data)=>{
                        console.error(`Error: ${data}`)
                       
                        reject(data)
                    })

                    run.on('close',(code)=>{
                        console.log(`Java program exited with code ${code}`)
                    })
                }else{
                    console.log(`Compilation failed with exit code; ${code}`)
                }
                // fs.unlinkSync(inputFilePath)
                // fs.unlinkSync(sourcePath)
            })
    
            compile.stderr.on('data',(data)=>{
                console.error(`compilation error : ${data}`)
                reject(data)
            })
            
         }
        )
   }catch(error){
     console.log("javaE: "+error)
   }

}

const pythonExecution=async(data,input,filename)=>{
    try{
        return new Promise(async(resolve,reject)=>{
            const fileName=filename || 'test.py';

            const inputfilename="input.txt";

            const sourcePath=path.join(__dirname,fileName);
           
            const inputFilePath=path.join(__dirname,inputfilename);

            await saveFile(sourcePath,data)
           
            fs.writeFileSync(inputFilePath,input,function(error){
                if(error){
                    console.log(error);
                    return;
                }
            })
                    const run=spawn('python',[sourcePath]);

                    const inputStream=fs.createReadStream(inputFilePath);

                    inputStream.pipe(run.stdin);

                    run.stdout.on('data',(data)=>{
                        console.log(`Output:${data}`);
                      
                        resolve(data)
                    })
                    

                    run.stderr.on('data',(data)=>{
                        console.error(`Error: ${data}`)
                       
                        reject(data)
                    })

                    run.on('close',(code)=>{
                        console.log(`Java program exited with code ${code}`)
                    })

                    // fs.unlinkSync(inputFilePath)
                    // fs.unlinkSync(sourcePath)
        })
    }catch(error){
        console.log("PY E"+error)
    }
}
module.exports={
    cplusExecution,cExecutions,javaExecutions,pythonExecution
}