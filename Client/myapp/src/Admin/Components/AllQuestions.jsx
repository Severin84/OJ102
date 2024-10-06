import React, { useEffect, useState } from 'react'
import axios from "axios";
import "./AllQuestions.css";
import {useNavigate} from "react-router-dom"
import UpadateQuestion from './UpadateQuestion';

const AllQuestions = ({ setComponent}) => {
    const [questions,setQuestions]=useState(["Title1","Title2","Title3"]);
    const navigate=useNavigate();

    const getallQuestionforAdmin=async()=>{
        try{
          const data=await axios.get(`${process.env.REACT_APP_BASE_URL}/api/question/getallQuestions`,
            {
              headers:{
                 'Content-Type':'application/json',
                 'Authorization':'Bearer '+localStorage.getItem('token')
              },
              withCredentials:true
             }
            );
            setQuestions(data?.data?.data)
        }catch(error){
           console.log(error)
        }
    }

    const deleteQuestion=async()=>{
       try{
          const response=await axios.delete(`${process.env.REACT_APP_BASE_URL}/api/question/deleteQuestion`,{
            headers:{
              'Content-Type':'application/json',
              'Authorization':'Bearer '+localStorage.getItem('token')
           },
           withCredentials:true
          })
       }catch(error){
         console.log(error)
       }
    }

    
    useEffect(()=>{
       getallQuestionforAdmin();
    },[])
   
  return (
    <div>
        <div >
          <table>
          <tr>
            <td>Question PID</td>
            <td>Question Title</td>
            <td>Question Difficulty</td>
            <td>Update Question</td>
            <td>Delete Question </td>
          </tr>
          </table>
            {
              questions && questions.map((value,idx)=>(
                 <div key={idx} style={{display:"flex"}}>
                   <table>
                    <tr>
                      <td>{value?.pid}</td>
                      <td>{value?.title}</td>
                      <td><div style={{backgroundColor:`${value?.difficulty?.color}`,width:"4rem",borderRadius:"0.5rem",display:"flex",justifyContent:"center",marginLeft:"1rem"}}>{value?.difficulty?.difficulty}</div></td>
                      <td><button className='updateButton' onClick={()=>{setComponent(<UpadateQuestion question={value}/>)}}>Update</button></td>
                      <td><button className='deleteButton' onClick={()=>deleteQuestion()}>Delete</button></td>
                    </tr>
                    </table>
                 </div>
              ))
            }
        </div>
    </div>
  )
}

export default AllQuestions

// <td><button className='updateButton' onClick={()=>{handleselectQuestiontobeupdated(value);setComponent(<UpadateQuestion question={value}/>)}}>Update</button></td>
//error => handleselectQuestiontobeupdated(value)