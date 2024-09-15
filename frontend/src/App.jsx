import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Access from './pages/access/Access'
import Chat from './pages/chat/Chat'

const App = () => {
  return (
    <>
      <Routes>
        <Route path='/' element={<Access/>} />
        <Route path='/chat' element={<Chat/>} />
      </Routes>
    </>
  )
}

export default App