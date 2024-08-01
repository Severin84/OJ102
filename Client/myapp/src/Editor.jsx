import React, { useEffect, useState } from 'react'
import axios from 'axios';
import './Editor.css';
import {Buffer} from "buffer"
import toast from 'react-hot-toast';
import {homepageQuestionDetails} from './store/selectors/HomepageQuestion';
import {useRecoilValue} from "recoil";

const Editor = () => {
  const codeTemplates=[
    {lang:"Java",template:`import java.util.*;\n public class test {\n public static void main(String[] args) \n {\n\tSystem.out.println("Hello World"); \n } \n}`},
    {lang:"C",template:`#include <stdio.h> \n int main() { \n\tprintf("Hello World"); \n\treturn 0;\n}`},
    {lang:"cpp",template:`#include <bits/stdc++.h> \nusing namespace std;\n\tint main() {\n\tcout << "Hello World";\n\treturn 0;\n}`},
    {lang:"Py",template:`print("Hello World")`},
  ]
  const homepageQuestionDetailsValue=useRecoilValue(homepageQuestionDetails)
  const [codetemplate,setCodetemplate]=useState()
  const [Lang,setLang]=useState('C');
  const [code,setCode]=useState();
  const [testInput,setTestInput]=useState();
  const [output,setOutput]=useState([]); 
  const [codeError,setCodeError]=useState();
  const [result,setResult]=useState([]);
  const [File,setFile]=useState(null);
  const [format,setFormat]=useState();
  const [change,setChange]=useState(false);
  const [inputTC,setInputTC]=useState();
  const [outputTC,setOutputTC]=useState();
  const [inputOROutput,setInputOROutput]=useState('input');
  const [DiscriptionandHistory,setDiscriptionandHistory]=useState('Description');
  const [user,setUser]=useState();
  const [currentQuestionHistory,setcurrentQuestionHistory]=useState([]);
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
      if(File===null){
        let resp=[];
        const response =await axios.post(`${process.env.REACT_APP_BASE_URL}/api/code/compile`,{
          lang:Lang,
          code:code,
          input:testInput
        },
        {
          headers:{
             'Content-Type':'application/json',
             'Authorization':'Bearer '+localStorage.getItem('token')
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
        const response =await axios.post(`${process.env.REACT_APP_BASE_URL}/api/code/upload`,formData,
        {
          headers:{
             'Content-Type':'multipart/form-data',
             'Authorization':'Bearer '+localStorage.getItem('token')
          },
          withCredentials:true
         })
        let b=Buffer.from(response.data.message.data);
        resp.push(b.toString())
        setOutput(resp)
      }
    }catch(error){
      setCodeError(Buffer.from(error?.response?.data?.message).toString()||'Error occured')
    }
    
  }

  
   const submitCode=async()=>{
       try{
          if(File===null){
              const response=await axios.post(`${process.env.REACT_APP_BASE_URL}/api/submit/submitCode`,{
                lang:Lang,
                code:code,
                pid:homepageQuestionDetailsValue?.pid
              },
              {
                headers:{
                   'Content-Type':'application/json',
                   'Authorization':'Bearer '+localStorage.getItem('token')
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
            formData.append("file",File)
            formData.append("pid",homepageQuestionDetailsValue?.pid)
            formData.append("lang",Lang)
            const response=await axios.post(`${process.env.REACT_APP_BASE_URL}/submit/submitupload`,formData,
            {
              headers:{
                 'Content-Type':'multipart/form-data',
                 'Authorization':'Bearer '+localStorage.getItem('token')
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
          setCodeError(Buffer.from(b)?.toString() || 'Error occured')
        }
       }
   }

   const solvedTheQuestion=async(question)=>{
      try{
          const response=await axios.post(`${process.env.REACT_APP_BASE_URL}/api/auth/userSolvedQuestion`,{pid:question?.pid,title:question?.title,description:question?.discription,difficulty:question?.difficulty,judgement:true,Language:Lang},
            {
              headers:{
                 'Content-Type':'application/json',
                 'Authorization':'Bearer '+localStorage.getItem('token')
              },
              withCredentials:true
             }
          )
      }catch(error){
        console.log(error)
        // toast.error(error?.response?.data?.message)
      }
   }

   const notsolvedTheQuestion=async(question)=>{
    try{
        const response=await axios.post(`${process.env.REACT_APP_BASE_URL}/api/auth/userSolvedQuestion`,{pid:question?.pid,title:question?.title,description:question?.discription,difficulty:question?.difficulty,judgement:false,Language:Lang},
          {
            headers:{
               'Content-Type':'application/json',
               'Authorization':'Bearer '+localStorage.getItem('token')
            },
            withCredentials:true
           }
        )
    }catch(error){
      console.log(error)
      //  toast.error(error?.response?.data?.message)
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
           if(correctans===answers?.length){
               solvedTheQuestion(homepageQuestionDetailsValue)
           }else{
               notsolvedTheQuestion(homepageQuestionDetailsValue);
           }
       }else{
          results.push("Something went wrong during evaluation")
       }
       setResult(results);
   }

   const getFile=(event)=>{
      setFile(event.target.files[0])
   }
 

   const getTestCase=async()=>{
     try{
        const response=await axios.post(`${process.env.REACT_APP_BASE_URL}/api/tc/getTC`,
        {
          pid:homepageQuestionDetailsValue?.pid
        },
          {
            headers:{
               'Content-Type':'application/json',
               'Authorization':'Bearer '+localStorage.getItem('token')
            },
            withCredentials:true
           }
        )
        response?.data?.message?.map((value,idx)=>{
        setInputTC(response?.data?.message?.[idx]?.TestCase)
        setOutputTC(response?.data?.message?.[idx]?.answers)
       })
        
     }catch(error){
      console.log(error)
      toast.error(error?.response?.data?.message)
     }
   }
   
   const handleInputOutPutShow=(value)=>{
     setInputOROutput(value);
   }

   const handleDiscriptionandHistory=(value)=>{
     setDiscriptionandHistory(value)
   }

   const gettheuser=async()=>{
     try{
         const response=await axios.get(`${process.env.REACT_APP_BASE_URL}/api/auth/getuser`,
           {
            headers:{
               'Content-Type':'application/json',
               'Authorization':'Bearer '+localStorage.getItem('token')
            },
            withCredentials:true
           }
         )
         const questHist=response?.data?.message?.questionSolved.filter((que)=>que.pid===homepageQuestionDetailsValue?.pid)
         console.log(questHist)
         setcurrentQuestionHistory(questHist);
        }catch(error){
           console.log(error)
           toast.error(error?.response?.data?.message)
        }
   }

   useEffect(()=>{
      getTestCase();
      gettheuser();
   },[homepageQuestionDetailsValue])


   useEffect(()=>{
       codeTemplates.map((value,idx)=>{
          if(value.lang===Lang){
            setCodetemplate(value.template)
          }
       })
   },[Lang])

   
  return (
    <>
    <div className='TheWholeEditor'>
    <div className='EditorQuestionTag' >
         <h2>Question: {homepageQuestionDetailsValue?.title}</h2>
          <div className='QuestionType' style={{backgroundColor:`${homepageQuestionDetailsValue?.difficulty?.color}`}}>
            <span>{homepageQuestionDetailsValue?.difficulty?.difficulty}</span>
           </div>
    </div>
    <div className='maindivider'>
    <div className='noneditor'>
       <div className='DiscriptionandHistory'>
        <button className='Description'  onClick={()=>handleDiscriptionandHistory('Description')}>Description</button>
        <button  className='History' onClick={()=>handleDiscriptionandHistory('History')}>History</button>
       </div>
       <div className='discriptionInputandOutput'>
       {
         DiscriptionandHistory==='Description' ? 
          <div className='descriptionDiv'>
            <h3 className="des"> Description:</h3>
            <span className='Questiondescription'>{homepageQuestionDetailsValue?.discription}</span>
            <div style={{height:"auto" ,width:"20rem",marginTop:"16rem"}} >
             Input:
              <div style={{height:"auto",width:"20rem",backgroundColor:"#29282e",borderRadius:"0rem 0rem 0rem 0.5rem",color:"white"}}>
                  <textarea value={inputTC}  cols={41}  rows={10} style={{borderRadius:"0rem 0rem 0rem 0.5rem",backgroundColor:"#29282e",border:"none",color:"white"}}></textarea>
              </div>
              Output:
              <div style={{height:"auto",width:"20rem",backgroundColor:"#29282e",borderRadius:"0rem 0rem 0.5rem 0rem",color:"white"}}>
                  <textarea value={outputTC} cols={41}  rows={10}  style={{borderRadius:"0rem 0rem 0.5rem 0rem",backgroundColor:"#29282e",border:"none",color:"white"}}></textarea>
              </div>
            </div>
          </div> 
            :
          <div>
            <div>
              {
                currentQuestionHistory.map((value,idx)=>(
                    <div key={idx}>
                        <table>
                        {
                          value.judgement===true ? 
                           <tr>
                             <td>{value?.time}</td>
                             <td style={{color:"#3ed318"}}>Accepted</td>
                             <td>{value?.Language}</td>
                           </tr>
                          :
                            <tr>
                              <td>{value?.time}</td>
                              <td style={{color:"#d90909"}}>Wrong Answer</td>
                              <td >{value?.Language}</td>
                            </tr>
                        }
                        </table>
                    </div>
                ))
              }
            </div>
          </div>
       } 
       </div>   
    </div>
    <div className='EditorHalf'>
      <div className="langdropAndfileInput">
             <div className='langdrop'>
              <select className='LanguageSelection' name="language" value={Lang}  onChange={selectedLang} style={{width:"9rem",height:"2rem"}}>
                <option value="Java" style={{width:"9rem",height:"2rem",fontSize:"1rem",borderRadius:'0.5rem'}}>Java</option>
                <br></br>
                <option value="C" style={{width:"9rem",height:"2rem",fontSize:"1rem",borderRadius:'0.5rem'}}>C</option>
                <option value="cpp" style={{width:"9rem",height:"2rem",fontSize:"1rem",borderRadius:'0.5rem'}}>cpp</option>
                <option value="Py" style={{width:"9rem",height:"2rem",fontSize:"1rem",borderRadius:'0.5rem'}}>Python</option>
              </select>
              </div>
              <div className='fileInput'>
                  <input className='fileInputField' type="file" id="file" name='file'  onChange={getFile}/>
                  <label className='labelforfile' for="file" onChange={getFile}>Submit a file</label>
              </div>
       </div>
      <div className='Editor' > 
        <div className='editorspace'>
          <div>
            <textarea style={{backgroundColor:"#29282e",color:"white",borderRadius:"0.5rem"}} defaultValue={codetemplate}  cols={80} rows={30} onChange={(e)=>updateCode(e.target.value)}></textarea>
          </div>
          </div>
      </div>
        <div className='Inputoutputandbuttonsarea'>
           <div className="InputOutputRunSubmit">
           <div className='Inputandoutputbuttons'>
            <button className='InputButton' onClick={()=>handleInputOutPutShow('input')}>Input</button>
            <button className='OutputButton' onClick={()=>handleInputOutPutShow('output')}>Output</button>
           </div>
           <div className='EditorButtons'>
            <button className='EditorRun'  onClick={()=>executeCode()}>Run</button>
            <button className='EditorSubmit' onClick={()=>submitCode()}>Submit</button>
           </div>
           </div>
           <div className='EditorInputOutputButtons'>
            { inputOROutput === 'input' ?
                 <div className='EditorInputOutput'>
                        <textarea name='paragraph_text' cols={70} rows={10} onChange={(e)=>updateInput(e.target.value)}></textarea>
                 </div> 
                 : 
                 <div className='EditorOutput' >
                 <div style={{display:"flex",marginLeft:"1rem",border:"solid",borderRadius:"0.5rem",height:"9rem",width:"35rem"}}>
                  Output:{
                  result?.length>0? result.map((data,idx)=>(
                         <div key={idx} style={{marginLeft:"1rem",marginTop:"0.5rem"}}>
                              {data==="Correct"?<span style={{backgroundColor:"#29ae17",color:"white",justifyContent:"space-between",borderRadius:"0.3rem",width:"10rem",height:'1.5rem'}}>{data}</span>:<span style={{backgroundColor:"#d21515",color:"white",justifyContent:"space-between",borderRadius:"0.3rem",width:"8rem"}}>{data}</span>}
                         </div>
                   )):output?.length>0 ? output.map((data,idx)=>(
                      <div key={idx}>
                         <span>{data}</span>
                      </div>
                   )):codeError
                }
                </div>
                </div>
            }
           </div>
        </div>
        </div>
        </div>
    </div>
    </>
  )
}

export default Editor