import React from 'react'
import './Login.css'
import logo from '../../assets/logo.png'

const Login = () => {
  return (
    <div className='login'>
      <img src={logo} alt="" className='login-logo' />
      <div className="login-form">
        <h1>Sign Up</h1>
        <form action="">
          <input type="text" placeholder='Enter Your Name'/>
          <input type="text" placeholder='Enter Your Email Address'/>
          <input type="password" placeholder='Enter Password'/>
          <button>Sign Up</button>

          <div className="login-help">
            <input type="checkbox" />
            <label htmlFor="">Remember Me</label>

            <p>Need Help?</p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login
