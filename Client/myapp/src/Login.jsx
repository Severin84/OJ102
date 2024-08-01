import axios from 'axios';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import "../src/Login.css";
import toast,{Toaster} from 'react-hot-toast'


const Login = () => {
  const navigate=useNavigate();
  const [email,setemail]=useState('');
  const [password,setpassword]=useState('');

  
  const userLogin=async()=>{
    try{
       const response=await axios.post(`${process.env.REACT_APP_BASE_URL}/api/auth/login`,
      {
        email:email,
        password:password
       },
       {
        headers:{
           'Content-Type':'application/json'
        },
        withCredentials:true
       })
      
       if(response.status===200){
         if(response?.data?.data?.role==="admin"){
          navigate("/admin")
         }else{
          navigate("/home")
         }

        
         localStorage.setItem("token",response?.data?.data?.refreshToken)
       }else{
          navigate("/login")
       }
       toast.success("LoggedIn Successfully")
    }catch(error){
     
      toast.error(error?.response?.data?.message)
      localStorage.setItem("token",null);
    }
  }
  
  return (
    <div className='LoginPage' >
    <div className='LoginBlock' >
        <div className='LoginDiv'>
            <input className='EmailInput' type="email" placeholder='email' onChange={(e)=>setemail(e.target.value)}/>
            <input className='PasswordInput' type="password" placeholder='password' onChange={(e)=>setpassword(e.target.value)}/>
            <div className='LoginButtonDiv' >
            <button className='LoginButton'  onClick={()=>userLogin()}>Submit</button>
            </div>
            <div className='LoginTextDiv' >
            <span>Not Registered?</span>
            <Link to={'/'} style={{textDecoration:"none"}}>
            <span>Register</span>
            </Link>
            </div>
        </div>
    </div>
      
    </div>
  )
}

export default Login