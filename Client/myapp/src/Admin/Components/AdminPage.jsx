import axios from 'axios';
import React, { useEffect, useState } from 'react'
import {toast} from 'react-hot-toast';
import "./AdminPage.css"
const AdminPage = () => {
  const [email,setEmail]=useState();
  const [password,setPassword]=useState();

  const [confirmEmail,setConfirmEmail]=useState();
  const [confirmPassword,setConfirmPassword]=useState();

  const [defaultEmail,setDefaultEmail]=useState();
  const [defaultPassword,setDefaultPassword]=useState();

  const [change,setChange]=useState(false);


  const update=async()=>{
     try{
         if(email===confirmEmail && password===confirmPassword){
            const response=await axios.post(`${process.env.REACT_APP_BASE_URL}/api/auth/updateAdmin`,{
               email:email,
               password:password
            },{

                headers:{
                    'Content-Type':'application/json',
                    'Authorization':'Bearer '+localStorage.getItem('token')
                },
                withCredentials:true
            }
        ) 
          if(response.status===200){
             toast.success("Admin's Email and Password Updated")
          }else{
             toast.error("Somthing went wrong while updating Admin's Email and Password")
          }
         }else{
            toast.error("Either Password or Email does not match with confirm Password or Email")
         }
         setChange(!change)
     }catch(error){
        console.log(error)
        toast.error("something went wrong while updating Admin")
     }
  }

  const getAdmin=async()=>{
    try{
            const response=await axios.get(`${process.env.REACT_APP_BASE_URL}/api/auth/getAdmin`,
           {
                headers:{
                    'Content-Type':'application/json',
                    'Authorization':'Bearer '+localStorage.getItem('token')
                },
                withCredentials:true
            }
        )
        
        setDefaultEmail(response?.data?.message?.email)
        setDefaultPassword(response?.data?.message?.password)
    }catch(error){
        console.log(error)
        toast.error("something went wrong while getting Admin")
    }
  }

  useEffect(()=>{
      getAdmin();
  },[change])
  return (
    <div className='AdminPage'>
        <div className='AdminTitle'>
            <h1>WELCOME TO ADMIN PAGE</h1>
        </div>
        <div className='AdminPageInput'>
            <div className='AdminCurrentDiv'>
                <div className='AdminCurrent'>
                   <h2>Current Email and Password</h2>
                </div>
                <div className='AdmincurrentInput' style={{color:"#12a112"}}>
                    <div className='AdmincurrentEmail'>
                       <h2>{defaultEmail}</h2>
                    </div>
                   <div className='AdmincurrentPassword'>
                       <h2>{defaultPassword}</h2>
                    </div>
                </div>
            </div>

            <div className="AdminPageUpdateDiv">
                <div className='AdminUpdate'>
                   <h2>Update Your Email and Password</h2>
                </div>
                <div className='AdminUpadateInput'>
                    <div className='AdminUpdateEmail'>
                    <input style={{width:"30vw",height:"3rem",borderRadius:"0.5rem",fontSize:"1.2rem"}} type="email" placeholder='Email' onChange={(e)=>setEmail(e.target.value)}/>
                    </div>
                    <div className='AdminUpdatePassword'>
                    <input style={{width:"30vw",height:"3rem",borderRadius:"0.5rem",fontSize:"1.2rem"}} type="password" placeholder='Password' onChange={(e)=>setPassword(e.target.value)}/>
                    </div>
                </div>
            </div>
               
            <div className='AdminPageConfirmDiv'>
                <div className='AdminConfirm'>
                   <h2>Confirm Your Email and Password</h2>
                </div>
                <div className='AdminConfirmInput'>
                    <div className='AdminConfirmEmail'>
                    <input style={{width:"30vw",height:"3rem",borderRadius:"0.5rem",fontSize:"1.2rem"}} type="email" placeholder='Email' onChange={(e)=>setConfirmEmail(e.target.value)}/>
                    </div>
                    <div className='AdminConfirmPassword'>
                    <input style={{width:"30vw",height:"3rem",borderRadius:"0.5rem",fontSize:"1.2rem"}} type="password" placeholder='Password' onChange={(e)=>setConfirmPassword(e.target.value)}/>
                    </div>
                </div>
            </div>
        </div>
        <div className='AdminUpdateButtondiv'>
            <button className='AdminUpdateButton' onClick={()=>update()}>Update</button>
        </div>
    </div>
  )
}

export default AdminPage