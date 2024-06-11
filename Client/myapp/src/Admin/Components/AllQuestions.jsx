import React, { useEffect, useState } from 'react'
import axios from "axios";


const AllQuestions = () => {
    const [questions,setQuestions]=useState(["Title1","Title2","Title3"])
    const getallQuestionforAdmin=async()=>{
        try{
          //"http://localhost:5000/api/question/getallQuestions"
      //${process.env.REACT_APP_BASE_URL}/question/getallQuestions
          const data=await axios.get(`http://localhost:5000/api/question/getallQuestions`,
            {
              headers:{
                 'Content-Type':'application/json'
              },
              withCredentials:true
             }
            );
            setQuestions(data?.data?.data)
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
            {
              questions && questions.map((value,idx)=>(
                 <div key={idx} style={{display:"flex",padding:'1rem'}}>
                    <h2 style={{marginLeft:"1rem"}}>{value?.pid}</h2>
                    <h2 style={{marginLeft:"1rem"}}>{value?.title}</h2>
                    <div style={{backgroundColor:`${value?.difficulty?.color}`,width:"4rem",borderRadius:"0.5rem",display:"flex",justifyContent:"center",marginLeft:"1rem"}}>{value?.difficulty?.difficulty}</div>
                    {/* <button style={{height:"2rem",width:"3rem",borderRadius:"0.5rem",backgroundColor:"#f92121"}}>Solve</button>
                    <button style={{height:"2rem",width:"5rem",borderRadius:"0.5rem",backgroundColor:"#17f129"}}>Mark As Done</button> */}
                 </div>
              ))
            }
        </div>
    </div>
  )
}

export default AllQuestions