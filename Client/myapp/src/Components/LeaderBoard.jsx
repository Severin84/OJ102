import axios from 'axios';
import React, { useEffect, useState } from 'react'
import './LeaderBoard.css'
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
const LeaderBoard = () => {
  const navigate=useNavigate();
  const [users,setUsers]=useState([])

    useEffect(()=>{
      getData()
    },[])
    const getData=async()=>{
      try{
          const response=await axios.get('http://localhost:5000/api/auth/getallusers',
            {
                headers:{
                  'Content-Type':'application/json'
                },
                withCredentials:true
            }
        );
        //console.log(response?.data?.message);
        setUsers(response?.data?.message?.sort((a,b)=>b.numberofquestionsolved-a.numberofquestionsolved))
      }catch(error){
        console.log(error)
        toast.error(error?.response?.data?.message)
        navigate('/login')
      }
       
    }
   
    
    //console.log(users)
  return (
    <div className='LeaderboardPage'>
        <div className='leaderboardpagediv'>
            <span className='leaderpagetitle'>LEADERBOARD</span>
        </div>
        <div className='ranklist'>
          <table>
            <tr>
              <td>Rank</td>
              <td>Name</td>
              <td>Question Solved</td>
            </tr>
           {
             users.map((value,idx)=>(
               <tr>
                <td>{idx+1}</td>
                <td>{value?.name}</td>
                <td>{value?.numberofquestionsolved}</td>
               </tr>
             ))
           }
          </table>
        </div>
    </div>
  )
}

export default LeaderBoard