import React, { useEffect, useRef } from 'react'
import './Navbar.css'
import logo from '../../assets/logo.png'
import search_icon from '../../assets/search_icon.svg'
import bell_icon from '../../assets/bell_icon.svg'
import profile_img from '../../assets/profile_img.png'
import caret_icon from '../../assets/caret_icon.svg'
import { logout } from '../../firebase'

const Navbar = () => {

  // we have created this just for adding darker background to nav while we scroll down for better visibilty
  const navRef = useRef();

  // logic for adding dark background to the nav while scrolling vertically 
  useEffect(() => {
    const handleScroll = () => {
      if (navRef.current) {
        if (window.scrollY >= 80) {
          navRef.current.classList.add('nav-dark');
        } else {
          navRef.current.classList.remove('nav-dark');
        }
      }
    };

    // Check karo agar DOM fully ready hai
    if (navRef.current) {
      window.addEventListener('scroll', handleScroll);
    }

    // Cleanup function
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [navRef.current]); // Dependency array mein `navRef.current` add karo

  return (
    <div ref={navRef} className='navbar'>

      {/* We have divided the navbar section into two parts - left and right  */}
      <div className="navbar-left">
        <img src={logo} alt="" />

        <ul>
          <li>Home</li>
          <li>TV Shows</li>
          <li>Movies</li>
          <li>New & Popular</li>
          <li>My List</li>
          <li>Browse by Languages</li>
        </ul>

      </div>

      <div className="navbar-right">
        <img src={search_icon} alt="" className='icons' />
        <p>Children</p>
        <img src={bell_icon} alt="" className='icons' />

        <div className="navbar-profile">
          <img src={profile_img} alt="" className='profile' />
          <img src={caret_icon} alt="" />

          <div className="dropdown-menu">
            <p>Profile</p>
            <p>Settings</p>
            <p>Contact</p>
            <p onClick={()=>{logout()}}>Sign Out</p>
          </div>

        </div>

      </div>

    </div>
  )
}

export default Navbar
