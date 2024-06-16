import React, { useState } from 'react'
import QuestionsUpload from './Components/QuestionsUpload'
import AllQuestions from './Components/AllQuestions'
import AllUsers from './Components/AllUsers'
import '../Admin/AdminHome.css';
import UpadateQuestion from './Components/UpadateQuestion';
import UploadTestCases from './Components/UploadTestCases';

const AdminHome = () => {
    const [component,setComponent]=useState(<QuestionsUpload/>);
    const [questionTobeupdated,setQuestionTobeupdated]=useState();
  return (
    <div>
        <div className='Adminpage' >
            <aside className='AdminAside' >
                <div className='AdminAsideDiv' >
                <div className='AdminAsideQuestionUpload'  onClick={()=>setComponent(<QuestionsUpload/>)}>QuestionsUpload</div>
                <div className='AdminAsideAllQuestions' onClick={()=>setComponent(<AllQuestions  setComponent={setComponent}/>)}>AllQuestions</div>
                <div className="updateQuestion" onClick={()=>setComponent(<UpadateQuestion questionTobeupdated={questionTobeupdated} />)}>Update Question</div>
                <div className="uploadTestCases" onClick={()=>setComponent(<UploadTestCases/>)}>Upload TestCases</div>
                {/* <div className='AminAsideAllUsers'  onClick={()=>setComponent(<AllUsers/>)}>AllUsers</div> */}
                </div>
            </aside>
            <div>
            <div className='AdminDashboard' >
               <span className='AdminDashboardTag' >DASHBOARD</span>  
            </div>
                <div className='AdminDashboardComponents' >
                  {
                    component
                  }
                </div> 
            </div>
        </div>
    </div>
  )
}

export default AdminHome