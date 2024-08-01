import axios from 'axios';
import React, {useState } from 'react'
import "./QuestionUpload.css"
const QuestionsUpload = () => {
    const DifficultyObj=[
        {difficulty:"Easy",color:"#2ad10d"},
        {difficulty:"Medium",color:"#d1750d"},
        {difficulty:"Hard",color:"#d10d0d"},
    ]
    const [title,setTitle]=useState();
    const [discription,setDiscription]=useState()
    const [testCase,setTestCase]=useState([]);
    const [correctAns,setCorrectAns]=useState([]);
    const [pid,setPid]=useState();
    const [Difficulty,setDifficulty]=useState("Easy");
    const [DifficultyInfo,setdifficultyInfo]=useState();
    
    const updateDis=(value)=>{
       setDiscription(value)
    }
    const updatetitle=(value)=>{
       setTitle(value)
    }
    const updatetestCase=(text)=>{
        setTestCase([text])
    }
    const updateCorrectAns=(value)=>{
        setCorrectAns(value)
    }
    const updatePID=(value)=>{
       setPid(value)
    }

    const uploadQuestion=async()=>{
        DifficultyObj.map((value,idx)=>{
            if(value.difficulty===Difficulty){
                setdifficultyInfo(value)
            }
        })
        const response=await axios.post(`${process.env.REACT_APP_BASE_URL}/api/question/createQuestion`,{
            title:title,
            discription:discription,
            pid:pid,
            difficulty:DifficultyInfo
        },
        {
            headers:{
               'Content-Type':'application/json',
               'Authorization':'Bearer '+localStorage.getItem('token')
            },
            withCredentials:true
        }
    )
        console.log(response)
    }

    const uploadTestCases=async()=>{
        const response=await axios.post(`${process.env.REACT_APP_BASE_URL}/api/tc/createTC`,{
            TestCase:testCase,
            answers:correctAns,
            pid:pid,
        },
        {
            headers:{
               'Content-Type':'application/json',
               'Authorization':'Bearer '+localStorage.getItem('token')
            },
            withCredentials:true
           })
        console.log(response)
    }
   
    const selectedDifficulty=(event)=>{
        setDifficulty(event.target.value);
    }

  return (
    <div style={{display:"flex"}}>
    <div>
        <div style={{display:"flex",position:"relative",justifyContent:"center",alignItems:"center",marginLeft:"-10rem",marginBottom:"1rem"}}>
            <h2>Question Upload</h2>
        </div>
        <div style={{display:"flex",justifyContent:"space-between"}}>
        <div style={{display:"flex"}}>
            <div>
            <span style={{fontSize:"1.5rem"}}>Title : </span>
            </div>
            <div>
             <textarea style={{borderRadius:"0.5rem"}} name='paragraph_text' cols={80} row={10} onChange={(e)=>updatetitle(e.target.value)}></textarea>
            </div>
        </div>
        <div>
        <div style={{display:"flex",marginRight:"5rem"}}>
                <span style={{fontSize:"1.5rem"}}>PID:</span>
                <input  style={{height:"2rem",borderRadius:"0.5rem"}} type="number"  onChange={(e)=>updatePID(e.target.value)} />
                <br></br>
                <div>
                <select className='DifficultySelection' name="Difficulty" value={Difficulty}  onChange={selectedDifficulty} style={{width:"9rem",height:"2rem",borderRadius:'0.5rem'}}>
                <option value="Easy" style={{width:"9rem",height:"2rem",fontSize:"1rem",borderRadius:'0.5rem'}}>Easy</option>
                <option value="Medium" style={{width:"9rem",height:"2rem",fontSize:"1rem",borderRadius:'0.5rem'}}>Medium</option>
                <option value="Hard" style={{width:"9rem",height:"2rem",fontSize:"1rem",borderRadius:'0.5rem'}}>Hard</option>
                </select>
                </div>
         </div>
         </div>
        </div>
        <div style={{display:"flex"}}>
            <div>
                <span style={{fontSize:"1.5rem"}}>Discription:</span>
            </div>
            <div style={{height:"20rem"}}>
             <textarea style={{borderRadius:"0.5rem"}} name='paragraph_text' cols={70} rows={20} onChange={(e)=>updateDis(e.target.value)}></textarea>
            </div>
        </div>
        <div style={{display:"flex"}}>
        <div style={{display:"flex"}}>
            <div>
                <span style={{fontSize:"1.5rem"}}>Example Input:</span>
            </div>
            <div>
             <textarea style={{borderRadius:"0.5rem"}} name='paragraph_text' cols={50} rows={10} onChange={(e)=>updatetestCase(e.target.value)}></textarea>
            </div>
        </div>
        <div style={{display:"flex",marginLeft:"2rem"}}>
            <div>
                <span style={{fontSize:"1.5rem"}}>Example Output:</span>
            </div>
            <div>
             <textarea style={{borderRadius:"0.5rem"}} name='paragraph_text' cols={50} rows={10} onChange={(e)=>updateCorrectAns(e.target.value)}></textarea>
            </div>
        </div>
        </div>
        <div>

        </div>
    </div>
    <div style={{width:"2rem",justifyContent:"space-between",display:"flex",marginRight:"-3rem"}}>
    <div>
        <button className='uploadQuestion' style={{height:"3rem",width:"6rem",borderRadius:"0.5rem",backgroundColor:"#96031a",color:"white"}} onClick={()=>uploadQuestion()}>Upload Question</button>
    </div>
    <div>
        <button className='UploadTestCase' style={{height:"3rem",width:"6rem",borderRadius:"0.5rem",backgroundColor:"#96031a",color:"white",scale:0.95}} onClick={()=>uploadTestCases()}>Upload TestCases</button>
    </div>
    </div>
    </div>
  )
}

export default QuestionsUpload