import React, { useState } from 'react'
import './Login.css'
import logo from '../../assets/logo.png'
import { signUp, login } from '../../firebase';

const Login = () => {

  const [signInState, setSignInState] = useState("Sign In"); // we have declared this to switch between signup and signin form by the parameters

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const user_auth = async (event) => {
    event.preventDefault();
    if (signInState === "Sign In") {
      await login(email, password)
    }
    else {
      await signUp(name, email, password)
    }
  }

  return (
    <div className='login'>
      <img src={logo} alt="" className='login-logo' />

      <div className="login-form">
        <h1>{signInState}</h1>

        <form>
          {/* now we are checking that if the signInState is having value "Sign Up" then, the name field will not be shown, because while logging we don't have to enter the name again */}
          {signInState === "Sign Up" ? <input value={name} onChange={(e) => { setName(e.target.value) }} type="text" placeholder='Enter Your Name' /> : <></>}
          <input value={email} onChange={(e) => { setEmail(e.target.value) }} type="text" placeholder='Enter Your Email Address' />
          <input value={password} onChange={(e) => { setPassword(e.target.value) }} type="password" placeholder='Enter Password' />
          <button onClick={user_auth} type='submit'>{signInState}</button>

          <div className="form-help">
            <div className="remember">
              <input type="checkbox" />
              <label htmlFor="">Remember Me</label>
            </div>
            <p>Need Help?</p>
          </div>
        </form>

        <div className="form-switch">
          {/* here if the signInState is set to "Sign In" then the "New to Netflix" text would be displayed otherwise "Already Have An Account" will be displayed  */}
          {/* when we click on "Sign Up" then the setSignInState will pass the new values as "Sign In" or "SignUp" and same function for SignIn onclick too, and this all will help us to switch between Login and SignUp form  */}
          {signInState === "Sign In" ? <p>New To Netflix? <span onClick={() => { setSignInState("Sign Up") }}>Sign Up Now</span></p> : <p>Already Have An Account? <span onClick={() => { setSignInState("Sign In") }}>Sign In Now</span></p>}
        </div>

      </div>
    </div>
  )
}

export default Login
