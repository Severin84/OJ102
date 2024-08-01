import React, { useState} from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import './Register.css';
import toast,{Toaster} from 'react-hot-toast'
const Register = () => {
  const navigate=useNavigate();
  const [name,setName]=useState('');
  const [email,setemail]=useState('');
  const [password,setpassword]=useState('');


  const register=async()=>{
    try{
      const response=await axios.post(`${process.env.REACT_APP_BASE_URL}/api/auth/register`,{
        name:name,
        email:email,
        password:password,
      })
     if(response.status===200){
       navigate('/login')
     }else{
       navigate("/register")
     }
      toast.success("Registered Successfully")
    }catch(error){
      toast.error(error?.response?.data?.message)
    }
  }


  return (
    <div className='RegisterPage' >
    <div className='RegisterBlock' >
    <div className='RegisterBlockDiv' >
        <input className='RegisterInputText' type="text" placeholder='name'  onChange={(e)=>setName(e.target.value)}/>
        <input className='RegisterInputEmail' type="email" placeholder='email'  onChange={(e)=>setemail(e.target.value)}/>
        <input className='RegisterInputPassword' type="password" placeholder='password'  onChange={(e)=>setpassword(e.target.value)}/>
        <div className='RegisterButtonDiv' >
        <button className='RegisterButton'  onClick={()=>register()}>Submit</button>
        </div>
        <div className='RegisterTextDiv' >
          <span>Registered?</span>
          <Link to={'/login'} style={{textDecoration:"none"}}>
          <span >Login</span>
          </Link>
        </div>
    </div>
    </div>
     
    </div>
  )
}

export default Register