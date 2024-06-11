import React, { useState } from 'react'
import QuestionsUpload from './Components/QuestionsUpload'
import AllQuestions from './Components/AllQuestions'
import AllUsers from './Components/AllUsers'
import '../Admin/AdminHome.css';

const AdminHome = () => {
    const [component,setComponent]=useState(<QuestionsUpload/>);
  return (
    <div>
        <div className='Adminpage' >
            <aside className='AdminAside' >
                <div className='AdminAsideDiv' >
                <div className='AdminAsideQuestionUpload'  onClick={()=>setComponent(<QuestionsUpload/>)}>QuestionsUpload</div>
                <div className='AdminAsideAllQuestions' onClick={()=>setComponent(<AllQuestions/>)}>AllQuestions</div>
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