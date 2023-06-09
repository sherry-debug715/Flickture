import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { login } from '../../store/session';
import InputField from '../ui/Input/InputField';
import BlackBackgroundBtn from '../ui/Buttons/blackBackgroundBtn';
import SignUpForm from './SignUpForm';
import "./auth.css";

const LoginForm = ({handleNavToHome}) => {
  const [errors, setErrors] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setModalContent, closeModal } = useModal();
  const dispatch = useDispatch();

  const handleOpenSignUpForm = () => {
    setModalContent(<SignUpForm 
      closeModal={closeModal}
    />)
  };


  const onLogin = async (e) => {
    e.preventDefault();
    const data = await dispatch(login(email, password));
    if (data) {
      setErrors(data);
    } else {
      closeModal();
      handleNavToHome()
    }
  };

  const handleDemoUserLogin = () =>{
   dispatch(login("demo@gmail.com", "password"))
   .then(closeModal);
   handleNavToHome();
  }

  const handleDemoUser2Login = () => {
    if(process.env.NODE_ENV === "production") {
      dispatch(login("henry_be@gmail.com", "password"))
      .then(closeModal);
      handleNavToHome();
    } else {
      dispatch(login("susannschuster@gmail.com", "password"))
      .then(closeModal);
      handleNavToHome();
    }
  }

  const loginBtnDisabled = () => {
    if(!email.length || !password.length) return true;
  };


  return (
    <div className='login-form-container'>
      <div className='login-form-inner-container'>

        <h1>Log in to Flickture</h1>
        <form onSubmit={onLogin} className='login-form'>
          <div className='login-form-error-container'>
            {errors.map((error, ind) => (
              <div key={ind}>{error}</div>
            ))}
          </div>
          <div>
            <InputField 
              size={{ m: 2, width: "30ch"}}
              setter={setEmail}
              val={email}
              label={"Email"}
              id={"standard-basic1"}
              multiline={false}
              variant={"standard"}
              labelFontSize={"20px"}   
              type="email"         
            /> 
          </div>
          <div>
            <InputField 
              size={{ m: 2, width: "30ch"}}
              setter={setPassword}
              val={password}
              label={"Password"}
              id={"standard-basic"}
              multiline={false}
              variant={"standard"}
              labelFontSize={"20px"}  
              type="password"       
            /> 
          </div>
            <button 
              type='submit'
              className={!loginBtnDisabled() ? "red-background-btn-container" : "red-background-btn-container-disabled"} 
              disabled={loginBtnDisabled()}
              id="login-form-loginbtn"
            >
              Login
            </button>
        </form>
        <div className='login-form-nav-to-signup'>
          Not a Flickture member? 
          <div onClick={handleOpenSignUpForm}>
            Sign up here.
          </div>
        </div>
        <div className='login-form-demo-btn-container'>
          <button
            onClick={handleDemoUserLogin}
            className='login-form-demo-login-btn'
          >
            Demo user 1
          </button>
          <button
            onClick={handleDemoUser2Login}
            className='login-form-demo-login-btn'
          >
            Demo user 2
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
