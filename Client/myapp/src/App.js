import {BrowserRouter as Router,Routes,Route} from "react-router-dom"
import './App.css';
import Login from './Login';
import Register from "./Register";
import Editor from "./Editor";
import Home from "./Home/Home";
import AdminHome from "./Admin/AdminHome";
import { useState } from "react";

function App() {
  const [question,setQuestion]=useState();
  return (
   
    <Router>
      <Routes>
      <Route path="/" element={<Register/>}/>
      <Route path="/editor" element={<Editor question={question}/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/home" element={<Home setQuestion={setQuestion}/>}/>
      <Route path="/admin" element={<AdminHome/>}/>
      </Routes>
    </Router>
  
  );
}

export default App;
