import React, { useState } from 'react';
import "./UpdateQuestion.css";
import axios from 'axios';

const UpadateQuestion = ({question}) => {
  const DifficultyObj=[
    {difficulty:"Easy",color:"#2ad10d"},
    {difficulty:"Medium",color:"#d1750d"},
    {difficulty:"Hard",color:"#d10d0d"},
]
const [title,setTitle]=useState();
const [discription,setDiscription]=useState();
const [Difficulty,setDifficulty]=useState(question?.difficulty?.difficulty);

    const updateDis=(value)=>{
      setDiscription(value)
    }

    const updatetitle=(value)=>{
      setTitle(value)
    }

   

    const selectedDifficulty=(event)=>{
      setDifficulty(event.target.value);
    }


    const handleUpdateQuestion=async()=>{
       try{
           const response=await axios.patch(`${process.env.REACT_APP_BASE_URL}/api/question/updateQuestion`,{
             title:title,
             discription:discription,
             pid:question?.pid
           },
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
       }
    }

  return (
    <div>
        <div style={{display:"flex"}}>
        <div style={{display:"flex"}}>
            <div>
            <span style={{fontSize:"1.5rem"}}>Title : </span>
            </div>
            <div>
             <textarea defaultValue={question?.title} style={{borderRadius:"0.5rem"}} name='paragraph_text' cols={80} row={10} onChange={(e)=>updatetitle(e.target.value)}></textarea>
            </div>
        </div>
       
        <div style={{display:"flex"}}>
        <span style={{fontSize:"1.5rem"}}>Diffculty :</span>
        <select defaultValue={question?.difficulty?.difficulty} className='DifficultySelection' name="Difficulty"  value={Difficulty}  onChange={selectedDifficulty} style={{width:"9rem",height:"2rem",borderRadius:'0.5rem'}}>
                <option value="Easy" style={{width:"9rem",height:"2rem",fontSize:"1rem",borderRadius:'0.5rem'}}>Easy</option>
                <option value="Medium" style={{width:"9rem",height:"2rem",fontSize:"1rem",borderRadius:'0.5rem'}}>Medium</option>
                <option value="Hard" style={{width:"9rem",height:"2rem",fontSize:"1rem",borderRadius:'0.5rem'}}>Hard</option>
        </select>
       
        </div>
        </div>
        <div>
        <div style={{display:"flex"}}>
            <div>
                <span style={{fontSize:"1.5rem"}}>Discription:</span>
            </div>
            <div style={{height:"20rem"}}>
             <textarea defaultValue={question?.discription} style={{borderRadius:"0.5rem"}} name='paragraph_text' cols={70} rows={20} onChange={(e)=>updateDis(e.target.value)}></textarea>
            </div>
        </div>
        </div>
        <div>

        </div>
        <div style={{display:"flex",justifyContent:"center"}}>
           <button style={{height:"3rem",width:"5rem",borderRadius:"0.5rem",backgroundColor:"#f64040"}} onClick={()=>handleUpdateQuestion()}>Update Question</button>
        </div>
        <div></div>
    </div>
  )
}

export default UpadateQuestion