import React, { useState } from 'react'
import './Access.css'
import assert from '../../assets/assets'
import { signup, login } from '../../config/firebase'


const Access = () => {
  const [access, setAccess] = useState("Login");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = (event)=>{
    event.preventDefault();
    if(access === "Sign Up"){
      // console.log(access);
      signup(userName, email, password);
    }
    else{
      login(email, password);
    }
  }

  return (
    <div className='access'>
        <img src={assert.logo_big} alt="" className='logo' />
        <form
         onSubmit={onSubmitHandler}
         className='access-form'>
            <h2>{access}</h2>
            {
              (access === "Sign Up")?
              <input
               onChange={(e)=> setUserName(e.target.value)}
               value={userName}
               type="text" placeholder='username' className='form-input' required/>
              : null
            }
            
            <input
             onChange={(e)=> setEmail(e.target.value)}
             value={email}
             type="email" placeholder='Email' className='form-input' required/>
            <input
             onChange={(e)=> setPassword(e.target.value)}
             value={password}
             type="text" placeholder='password' className='form-input' required/>
            <button type='submit'>{(access === "Sign Up")?"Create Account":"Login"}</button>
            <div className="access-term">
                <input type="checkbox" required/>
                <p>Agree to the terms of use & privacy policy.</p>
            </div>
            <div className="access-forgot">
                <p className='access-toggle'>{(access === "Sign Up")?"Already have an account" : "Create an Account"} <span className='click' onClick={()=>{setAccess((access === "Sign Up")?"Login":"Sign Up")}}>
                  {(access === "Sign Up")?"Login ":"Click "} here</span></p>
            </div>
        </form>
    </div>
  )
}

export default Access