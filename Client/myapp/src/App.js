import {BrowserRouter as Router,Routes,Route, Outlet} from "react-router-dom"
import './App.css';
import Login from './Login';
import Register from "./Register";
import Editor from "./Editor";
import Home from "./Home/Home.jsx";
import AdminHome from "./Admin/AdminHome";
import { useState } from "react";
import Header from "./Components/Header";
import LeaderBoard from "./Components/LeaderBoard";
import {Toaster} from 'react-hot-toast'

const NavLayout=()=>(
   <>
    <Header/>
    <Outlet/>
   </>
)
function App() {
  const [question,setQuestion]=useState();
  return (
    <>
    <Router>
      <Routes>
      <Route path="/" element={<Register/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/leaderboard" element={<NavLayout/>}>
          <Route index element={<LeaderBoard/>}/>
      </Route>
      <Route path="/editor" element={<NavLayout/>}>
          <Route index element={<Editor question={question}/>}/>
      </Route>
      <Route path="/home" element={<NavLayout/>}>
          <Route index element={<Home setQuestion={setQuestion}/>}/>
      </Route>
      <Route path="/admin" element={<NavLayout/>}>
          <Route index element={<AdminHome/>}/>
      </Route>
      </Routes>
    </Router>
    <Toaster/>
    </>
  );
}

export default App;
