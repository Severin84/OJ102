import React, { useEffect, useState } from 'react'
import './UploadTestCases.css';
import axios from 'axios';
import {toast} from 'react-hot-toast'

const UploadTestCases = () => {
    const [inputTestCase,setInputTestCase]=useState();
    const [outputTestCase,setOutputTestCase]=useState();
    const [pid,setPid]=useState();
    const [change,setChange]=useState(false)
    const [input,setInput]=useState([])
    const [output,setOutput]=useState([])
   
    const updatetestCase=(value)=>{
        setInputTestCase(value)
    }

    const updateCorrectAns=(value)=>{
        setOutputTestCase(value)
    }

    const updatePID=(value)=>{
        setPid(value)
    }

    const uploadInputOutputTestCases=async()=>{
       try{
           const response = await axios.post('http://localhost:5000/api/tc/createInputOutputTC',{
                TestInput:inputTestCase,
                TestOutput:outputTestCase,
                pid:pid
           },{
                headers:{
                    'Content-Type':'application/json'
                },
                withCredentials:true
           })
           console.log(response)
           setChange(!change)
       }catch(error){
        //    console.log(error)
           toast.error(error?.response?.data?.message)
       }
    }

    const getInputOutputTestCases=async()=>{
        try{
           const response=await axios.post('http://localhost:5000/api/tc/getInputOutputTC',
           {
                pid:pid
           },{
                headers:{
                    'Content-Type':'application/json'
                },
                withCredentials:true
           })
            setInput(response?.data?.message?.TestInput)
            setOutput(response?.data?.message?.TestOutput)
           console.log(response)
        }catch(error){
            //  console.log(error)
             toast.error(error?.response?.data?.message)
        }
    }

    const handleDeleteTC=async(input,output)=>{
        try{
            const response=await axios.post('http://localhost:5000/api/tc/deleteInputOutPutTC',
                {
                     pid:pid,
                     input:input,
                     output:output
                },{
                     headers:{
                         'Content-Type':'application/json'
                     },
                     withCredentials:true
                })
                console.log(response)
                setChange(!change)
        }catch(error){
            console.log(error)
        }
    }

    // useEffect(()=>{
    //    getInputOutputTestCases()
    // },[])
  useEffect(()=>{
      getInputOutputTestCases();
      uploadInputOutputTestCases()
  },[change])

  return (
    <div>
        <div style={{display:"flex" ,justifyContent:"center",marginRight:"35rem",marginBottom:"3rem"}}>
            <span style={{fontSize:"1.5rem"}}>PID:</span>
            <input  style={{height:"2rem",borderRadius:"0.5rem"}} type="number"  onChange={(e)=>updatePID(e.target.value)} />
        </div>
        <div style={{display:"flex",justifyContent:"space-between",width:"80vw"}}>
                <div style={{display:"flex"}}>
                <div style={{display:"flex"}}>
                    <div>
                        <span style={{fontSize:"1.5rem"}}>Input:</span>
                    </div>
                    <div>
                    <textarea style={{borderRadius:"0.5rem"}} name='paragraph_text' cols={50} rows={10} onChange={(e)=>updatetestCase(e.target.value)}></textarea>
                    </div>
                </div>
                <div style={{display:"flex",marginLeft:"2rem"}}>
                    <div>
                        <span style={{fontSize:"1.5rem"}}>Output:</span>
                    </div>
                    <div>
                    <textarea style={{borderRadius:"0.5rem"}} name='paragraph_text' cols={50} rows={10} onChange={(e)=>updateCorrectAns(e.target.value)}></textarea>
                    </div>
                </div>
                </div>
                <div>
                    <button className='uploadButton' onClick={()=>uploadInputOutputTestCases()}>Upload</button>
                </div>
                <div>
                    <button className='getTestCases' onClick={()=>getInputOutputTestCases()}>Get TestCases</button>
                </div>
        </div>
        <div style={{marginLeft:"10rem",display:'flex',justifyContent:"space-between",width:"40vw",marginTop:"5rem"}}>
            {/* <table>
                <tc>
                    <td>Input</td>
                    <td>output</td>
                </tc>
                <tr>
                    {
                        input.map((value,idx)=>(
                            <tc>
                            <td>{value}</td>
                            <td>{output[idx]}</td>
                            <td><button className='DeleteButton' onClick={()=>handleDeleteTC(value,output[idx])}>Delete</button></td>
                            </tc>
                        ))
                    }
                </tr>
            </table> */}
            <div>
                <div style={{fontSize:"1.5rem"}}>Input</div>
            {
              input.map((value,idx)=>(
                  <div key={idx} style={{fontSize:"1.1rem",marginTop:'1rem'}}>{value}</div>
              ))
            }
            </div>
            <div>
                <div style={{fontSize:"1.5rem"}}>Output</div>
            {
              output.map((value,idx)=>(
                  <div key={idx} style={{fontSize:"1.1rem",marginTop:'1rem'}}>{value}</div>
              ))
            }
            </div>
            <div> 
            {
              output.map((value,idx)=>(
                  <button key={idx} className='DeleteButton' onClick={()=>handleDeleteTC(value,output[idx])}>Delete</button>
              ))
            }
            </div>
        </div>
    </div>
  )
}

export default UploadTestCases