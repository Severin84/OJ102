import React, { useEffect } from 'react';
import {useNavigate} from "react-router-dom"
import './Header.css'
import axios from 'axios';
import toast from "react-hot-toast";
import { PiPlantFill } from "react-icons/pi";
const Header = () => {
 const navigate=useNavigate();
 
 const handleLogout= async()=>{
    try{
       const response=await axios.post('http://localhost:5000/api/auth/logout',
        {

        }
       ,
       {
        withCredentials:true
       }
      );
       //console.log(response)
       navigate('/login')
    }catch(error){
        toast.error(error?.response?.data?.message)
        navigate('/login')
    }
 }
 
  return (
    <div className='Navbar'>
         <div className='logo'>
            <PiPlantFill style={{color:"#d89518",fontSize:"3rem"}}/>
        </div>
        <div className='NavbarChildren'>
            <button className='home' onClick={()=>navigate('/home')}>Home</button>
            <button className='leaderboard' onClick={()=>navigate('/leaderboard')}>LeaderBoard</button>
            <button className='logout' onClick={()=>handleLogout()}>Logout</button>
        </div>
    </div>
  )
}

export default Header