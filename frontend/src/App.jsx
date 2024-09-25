import React, { useContext, useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Access from './pages/access/Access'
import Chat from './pages/chat/Chat'
import ProfileUpdata from './pages/profileUpdate/ProfileUpdate'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './config/firebase'
import { AppContext } from './context/AppContext'

const App = () => {
  const {loadUserData} = useContext(AppContext)
  const navigate = useNavigate()
  useEffect(() =>{
    onAuthStateChanged(auth, async(user)=>{
      if(user){
        navigate('/chat')
        // console.log(user.uid)
        await loadUserData(user.uid)
      }
      else{
        navigate('/')
      }
    })
  }, [])

  return (
    <>
      <ToastContainer/>
      <Routes>
        <Route path='/' element={<Access/>} />
        <Route path='/chat' element={<Chat/>} />
        <Route path='/profile' element={<ProfileUpdata/>} />
      </Routes>
    </>
  )
}

export default App