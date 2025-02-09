import React, { useEffect } from 'react';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Player from './pages/Player/Player';
import Profile from './pages/Profile/Profile';
import { HistoryProvider } from './contexts/HistoryContext';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LikeProvider } from './contexts/LikeContext';



const App = () => {

  const navigate = useNavigate();
  const location = useLocation(); // it access the current location which is from URL

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        // if the user is authenticated and is on login page, then navigate to home so that when the user is logged in and tries to change the URL it wont redirect always on home page
        if (location.pathname === '/login') {
          navigate('/');
        }
      }
      
      else {
        // if the user is not logged in and tries to access any page other than the login page, redirect them to the login page
        if (location.pathname !== '/login') {
          navigate('/login');
        }
      }
    })
  }, [location, navigate])

  return (
    <HistoryProvider>
       <LikeProvider>
    <div>
      <ToastContainer theme='dark' />
      {/* Here we are implementing Routing to prevent the loading while moving to another page */}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/player/:id' element={<Player />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>

    </div>
    </LikeProvider>
    </HistoryProvider>
  )
}

export default App
