import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Access from './pages/access/Access'
import Chat from './pages/chat/Chat'
import ProfileUpdata from './pages/profileUpdate/ProfileUpdate'

const App = () => {
  return (
    <>
      <Routes>
        <Route path='/' element={<Access/>} />
        <Route path='/chat' element={<Chat/>} />
        <Route path='/profile' element={<ProfileUpdata/>} />
      </Routes>
    </>
  )
}

export default App