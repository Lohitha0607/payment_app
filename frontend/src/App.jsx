
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './App.css'
import { Signup } from './pages/Signup'
import { Signin } from './pages/Signin'
import { Dashboard } from './pages/Dashboard'
import { Send } from './pages/Send'

function App() {
  

  return (
    <>
      <BrowserRouter>
      <Routes>
          <Route path="/signup" element={<Signup></Signup>}></Route>
          <Route path="/signin" element={<Signin></Signin>}></Route>
          <Route path="/dashboard" element={<Dashboard></Dashboard>}></Route>
          <Route path="/send" element={<Send></Send>}></Route>
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
