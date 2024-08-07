import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import '../Home/Home.css';
import toast from 'react-hot-toast'
import {homepageQuestionState} from "../store/atoms/HomepageQuestion";
import {useRecoilState,useRecoilValue,useSetRecoilState} from "recoil"

const Home = () => {
  const [questions,setQuestions]=useState([]);
  const navigate=useNavigate();
  const sethomepageQuestion=useSetRecoilState(homepageQuestionState)

  useEffect(()=>{
      getQuestions()
  },[])

  const getQuestions=async()=>{
    try{
      const response=await axios.get(`${process.env.REACT_APP_BASE_URL}/api/question/getallQuestions`,
        {
          headers:{
             'Content-Type':'application/json',
             'Authorization':'Bearer '+localStorage.getItem('token')
          },
          withCredentials:true
         }
        )
        setQuestions(response?.data?.data)
    }catch(error){
      toast.error(error?.response?.data?.message)
      navigate('/login')
    }
  }

 
  return (
    <div className='HomePage'>
       <div className='QuestionTitle' >
            <h2>Questions</h2>
       </div>
      <div className='QuestionBlock' >
        {
          questions && questions.map((value,idx)=>(
            <div className='QuestionsQuestionDiv'  key={idx}>
              <h4>{idx+1}</h4>
              <h4 className='QuestionsQuestion'  onClick={()=>{sethomepageQuestion(value);navigate("/editor")}}>{value?.title}</h4>
              <div style={{marginLeft:"1rem",backgroundColor:`${value?.difficulty?.color}`,width:"5rem",borderRadius:"0.5rem",display:"flex",justifyContent:"center"}}>{value?.difficulty?.difficulty}</div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Home