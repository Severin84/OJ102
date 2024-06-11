import React, { useEffect, useState } from 'react'
import axios from 'axios';
import './Editor.css';
import {Buffer} from "buffer"
const Editor = ({question}) => {
  const codeTemplates=[
    {lang:"Java",template:"import java.util.*;\n public class test {\n public static void main(String[] args) \n {\n\tSystem.out.println('Hello World') \n } \n}"},
    {lang:"C",template:"#include <stdio.h> \n int main() { \n\tprintf('Hello World'); \n\treturn 0;\n}"},
    {lang:"cpp",template:"#include <bits/stdc++.h> \nusing namespace std;\n\tint main() {\n\tcout << 'Hello World';\n\treturn 0;\n}"},
    {lang:"Py",template:"print('Hello World')"},
  ]
  

  const [codetemplate,setCodetemplate]=useState()
  const [Lang,setLang]=useState('C');
  const [code,setCode]=useState();
  const [testInput,setTestInput]=useState();
  const [output,setOutput]=useState([]); 
  const [codeError,setCodeError]=useState();
  const [result,setResult]=useState([]);
  const [File,setFile]=useState();
  const [format,setFormat]=useState();
  const [change,setChange]=useState(false);
  const [inputTC,setInputTC]=useState();
  const [outputTC,setOutputTC]=useState()

  const selectedLang=(event)=>{
    setLang(event.target.value);
  }

  const updateCode=(value)=>{
     setCode(value);
  }

  const updateInput=(value)=>{
     setTestInput(value)
  }  


  const executeCode=async()=>{
    try{
      if(format==='written'){
        let resp=[];
        //'http://localhost:5000/api/code/compile'
        //${process.env.REACT_APP_BASE_URL}
        const response =await axios.post(`http://localhost:5000/api/code/compile`,{
          lang:Lang,
          code:code,
          input:testInput
        },
        {
          headers:{
             'Content-Type':'application/json'
          },
          withCredentials:true
         })
        let b=Buffer.from(response.data.message.data);
        resp.push(b.toString())
        setOutput(resp)
      }else{
        let resp=[];
        const formData=new FormData();
        formData.append("file",File)
        formData.append("lang",Lang)
        formData.append("input",testInput)
        //'http://localhost:5000/api/code/upload'
        //${process.env.REACT_APP_BASE_URL}/code/upload
        const response =await axios.post(`http://localhost:5000/api/code/upload`,formData,
        {
          headers:{
             'Content-Type':'multipart/form-data'
          },
          withCredentials:true
         })
        let b=Buffer.from(response.data.message.data);
        resp.push(b.toString())
        setOutput(resp)
      }
    }catch(error){
      console.log(Buffer.from(error?.response?.data?.message).toString())
      setCodeError(Buffer.from(error?.response?.data?.message).toString()||'Error occured')
    }
    
  }
   const runtheCode=()=>{
      if(File===undefined){
        setFormat('written');
        executeCode();
        setChange(!change);
      }else{
        setFormat('file');
        executeCode();
        setChange(!change)
      }
   }

   const submittheCode=()=>{
      if(File===undefined){
        setFormat('written');
        submitCode();
      }else{
        setFormat('file');
        submitCode();
      }
   }
   const submitCode=async()=>{
       try{
          if(format==='written'){
            //'http://localhost:5000/api/submit/submitCode'
            //${process.env.REACT_APP_BASE_URL}/submit/submitCode
              const response=await axios.post(`http://localhost:5000/api/submit/submitCode`,{
                lang:Lang,
                code:code,
                pid:question?.pid
              },
              {
                headers:{
                   'Content-Type':'application/json'
                },
                withCredentials:true
               })
              let results=[];
              response?.data?.message.map((data,idx)=>{
              let bufferData=Buffer.from(data?.data);
              results.push(bufferData.toString().replace(/\r?\n|\r/g, ''));
              })
              checkresponse(response?.data?.answers,results)
          }else{
            const formData=new FormData();
            // console.log("V")
            // console.log(File)
            // console.log("^")
            formData.append("file",File)
            formData.append("pid",question?.pid)
            formData.append("lang",Lang)
            console.log(formData)
            //'http://localhost:5000/api/submit/submitupload'
            //${process.env.REACT_APP_BASE_URL}/submit/submitupload
            const response=await axios.post(`http://localhost:5000/api/submit/submitupload`,formData,
            {
              headers:{
                 'Content-Type':'multipart/form-data'
              },
              withCredentials:true
             }
            )

            let results=[];
            response?.data?.message.map((data,idx)=>{
            let bufferData=Buffer.from(data?.data);
            results.push(bufferData.toString().replace(/\r?\n|\r/g, ''));
            })
            checkresponse(response?.data?.answers,results)
          }
       }catch(error){
        let errorData=error?.response?.data?.message;
        let b=errorData;
        if(b!==undefined){
          console.log(Buffer.from(b)?.toString())
          setCodeError(Buffer.from(b)?.toString() || 'Error occured')
        }
       }
   }

   const solvedTheQuestion=async(question)=>{
      try{
        //"http://localhost:5000/api/submit/updateSolvedQuestion"
        //${process.env.REACT_APP_BASE_URL}/submit/updateSolvedQuestion
          const response=await axios.post(`http://localhost:5000/api/submit/updateSolvedQuestion`,{question:question},
            {
              headers:{
                 'Content-Type':'application/json'
              },
              withCredentials:true
             }
          )
          console.log(response);
      }catch(error){
         console.log(error)
      }
   }
   const checkresponse=(answers,response)=>{
       let results=[];
       let correctans=0
       if(answers.length===response.length){
           for(let i=0;i<answers.length;i++){
                if(answers[i]!==response[i]){
                    results.push('Wrong');
                }else{
                    results.push("Correct")
                    correctans+=1;
                }
           }
          //  if(correctans===answers?.length){
          //      solvedTheQuestion(question)
          //  }
       }else{
          results.push("Something went wrong during evaluation")
       }
       setResult(results);
   }

   const getFile=(event)=>{
      setFile(event.target.files[0])
      console.log("V")
      console.log(event.target.files[0])
      console.log("^")
      //console.log(event.target.files[0])
   }
 
   const uploadFiles=async(e)=>{
       e.preventDefault();
       try{
        let resp=[];
        const formData=new FormData();
        formData.append("file",File)
        formData.append("lang",Lang)
        formData.append("input",testInput)
        //"http://localhost:5000/api/code/upload"
        //${process.env.REACT_APP_BASE_URL}/code/upload
        const response=await axios.post(`http://localhost:5000/api/code/upload`,formData,
        {
          headers:{
             'Content-Type':'application/json'
          },
          withCredentials:true
         }
        )
        let b=Buffer.from(response?.data?.message?.data);
        resp.push(b.toString())
        setOutput(resp)
       }catch(error){
         setOutput([]);
         setResult([]);
         console.log(error)
       }
   }

   const getTestCase=async()=>{
     try{
      //"http://localhost:5000/api/tc/getTC"
      //${process.env.REACT_APP_BASE_URL}/tc/getTC
        const response=await axios.post(`http://localhost:5000/api/tc/getTC`,
        {
          pid:question?.pid
        },
          {
            headers:{
               'Content-Type':'application/json'
            },
            withCredentials:true
           }
        )
       //console.log(response?.data?.message)
       response?.data?.message?.map((value,idx)=>{
        setInputTC(response?.data?.message?.[idx]?.TestCase)
       // console.log(response?.data?.message?.[idx]?.TestCase)
        setOutputTC(response?.data?.message?.[idx]?.answers)
       })
        
     }catch(error){
       console.log(error)
     }
   }


   useEffect(()=>{
      getTestCase();
   },[question])


   useEffect(()=>{
       codeTemplates.map((value,idx)=>{
          if(value.lang===Lang){
            setCodetemplate(value.template)
          }
       })
   },[Lang])

   
   useEffect(()=>{

   },[change])
   
  return (
    <>
    <div>
    <div className='EditorQuestionTag' >
         <h2>Question: {question?.title}</h2>
    </div>
    <div className='QuestionType' style={{backgroundColor:`${question?.difficulty?.color}`}}>
       <span>Type:{question?.difficulty?.difficulty}</span>
    </div>
    <div>
      <div className='langdrop'>
          <select className='LanguageSelection' name="language" value={Lang}  onChange={selectedLang} style={{width:"9rem",height:"2rem"}}>
            <option value="Java" style={{width:"9rem",height:"2rem",fontSize:"1rem",borderRadius:'0.5rem'}}>Java</option>
            <br></br>
            <option value="C" style={{width:"9rem",height:"2rem",fontSize:"1rem",borderRadius:'0.5rem'}}>C</option>
            <option value="cpp" style={{width:"9rem",height:"2rem",fontSize:"1rem",borderRadius:'0.5rem'}}>cpp</option>
            <option value="Py" style={{width:"9rem",height:"2rem",fontSize:"1rem",borderRadius:'0.5rem'}}>Python</option>
          </select>
        </div>
    </div>
      <div className='Editor' >
        <div className='descriptionDiv'>
          <h3 className="des"> Description:</h3>
          <span className='description'>{question?.discription}</span>
          <div style={{height:"10rem" ,width:"20rem",marginTop:"16rem",display:"flex"}} >
            <div style={{height:"10rem",width:"10.1rem",backgroundColor:"#29282e",borderRadius:"0rem 0rem 0rem 0.5rem",color:"white"}}>
               Input:
               <textarea value={inputTC} col={10} rows={9} style={{borderRadius:"0rem 0rem 0rem 0.5rem",backgroundColor:"#29282e",border:"none",color:"white"}}></textarea>
            </div>
            <div style={{height:"10rem",width:"10.1rem",backgroundColor:"#29282e",borderRadius:"0rem 0rem 0.5rem 0rem",color:"white"}}>
               Output:
               <textarea value={outputTC} col={10} rows={9} style={{borderRadius:"0rem 0rem 0.5rem 0rem",backgroundColor:"#29282e",border:"none",color:"white"}}></textarea>
            </div>
          </div>
        </div>
        <div className='editorspace'>
          <div>
            <textarea style={{backgroundColor:"#29282e",color:"white"}} defaultValue={codetemplate}  cols={50} rows={30} onChange={(e)=>updateCode(e.target.value)}></textarea>
          </div>
          <div>
            <form onSubmit={uploadFiles}>
           <input type="file"  onChange={getFile}/>
           </form>
          </div>
        </div>
        <div className='EditorInputOutputButtons' >
           <div className='EditorInputOutput' >
            <h4 style={{marginLeft:'1rem'}}>Input:</h4>
           <textarea name='paragraph_text' cols={50} rows={10} onChange={(e)=>updateInput(e.target.value)}></textarea>
           <div className='EditorOutput' >
            <div style={{display:"flex",marginLeft:"1rem"}}>
             Output:{
             result?.length>0? result.map((data,idx)=>(
                    <div key={idx} style={{marginLeft:"1rem",marginTop:"0.5rem"}}>
                         {data==="Correct"?<span style={{backgroundColor:"#29ae17",color:"white",justifyContent:"space-between",borderRadius:"0.3rem",width:"8rem",height:'1.5rem'}}>{data}</span>:<span style={{backgroundColor:"#d21515",color:"white",justifyContent:"space-between",borderRadius:"0.3rem",width:"8rem"}}>{data}</span>}
                    </div>
              )):output?.length>0 ? output.map((data,idx)=>(
                 <div key={idx}>
                    <span>{data}</span>
                 </div>
              )):codeError
           }
           </div>
           </div>
           </div>
           <div className='EditorButtons'>
            <button className='EditorRun'  onClick={()=>runtheCode()}>Run</button>
            <button className='EditorSubmit' onClick={()=>submittheCode()}>Submit</button>
           </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default Editor