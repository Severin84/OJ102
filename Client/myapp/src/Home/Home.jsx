import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import '../Home/Home.css'

//"http://localhost:5000/api/question/getallQuestions"
//${process.env.REACT_APP_BASE_URL}
const Home = ({setQuestion}) => {
  const [questions,setQuestions]=useState([]);
  const navigate=useNavigate();


  const getQuestions=async()=>{
    try{
      const response=await axios.get(`http://localhost:5000/api/question/getallQuestions`,
        {
          headers:{
             'Content-Type':'application/json'
          },
          withCredentials:true
         }
        )
        console.log(response);
        // if(response.status!==200){
        //    navigate("/login")
        // }
        setQuestions(response?.data?.data)
    }catch(error){
      console.log(error);
    }
    
  }
 console.log(questions)
  useEffect(()=>{
      getQuestions();
  },[])

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
              <h4 className='QuestionsQuestion'  onClick={()=>{setQuestion(value);navigate("/editor")}}>{value?.title}</h4>
              <div style={{marginLeft:"1rem",backgroundColor:`${value?.difficulty?.color}`,width:"5rem",borderRadius:"0.5rem",display:"flex",justifyContent:"center"}}>{value?.difficulty?.difficulty}</div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Home