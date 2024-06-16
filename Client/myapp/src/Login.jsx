import axios from 'axios';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import "../src/Login.css";
import toast,{Toaster} from 'react-hot-toast'

//"http://localhost:5000/api/auth/login"
//${process.env.REACT_APP_BASE_URL}
const Login = () => {
  const navigate=useNavigate();
  const [email,setemail]=useState('');
  const [password,setpassword]=useState('');

  const userLogin=async()=>{
    try{
       const response=await axios.post(`http://localhost:5000/api/auth/login`,
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
       //console.log(response)
       if(response.status===200){
         if(response?.data?.data?.role==="admin"){
          navigate("/admin")
         }else{
          navigate("/home")
         }
       }else{
          navigate("/login")
       }
       toast.success("LoggedIn Successfully")
    }catch(error){
      // console.log(error)
      toast.error(error?.response?.data?.message)
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