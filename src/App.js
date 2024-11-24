import React from 'react'
import Home from './pages/Home/Home'
import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login/Login'

const App = () => {
  return (
    <div>
      {/* Here we are implementing Routing to prevent the loading while moving to another page */}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
      </Routes>
      
    </div>
  )
}

export default App
