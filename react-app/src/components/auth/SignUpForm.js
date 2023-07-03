import React, { useState } from 'react';
import { useDispatch } from 'react-redux'
import { signUp } from '../../store/session';
import { useModal } from '../../context/Modal';
import InputField from '../ui/Input/InputField';
import "./auth.css";

const SignUpForm = ({handleNavToHome}) => {
  const [errors, setErrors] = useState([]);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const { closeModal } = useModal();
  const dispatch = useDispatch();

  const onSignUp = async (e) => {
    e.preventDefault();
    if (password === repeatPassword) {
      const data = await dispatch(signUp(username, email, password, first_name, last_name));
      if (data) {
        setErrors(data)
      } else {
        closeModal();
        handleNavToHome();
      }
    }
  };

  const btnDisabled = () => {
    if(!username.length || !email.length || !password.length || !repeatPassword.length || !first_name.length || !last_name.length) return true;
  };


  return (
    <div className='signup-form-container'>
      <div className='signup-form-inner-container'>
        <h1>Sign up to Flickture</h1>
        <form onSubmit={onSignUp} className='signup-form'>
          <div>
            {errors.map((error, ind) => (
              <div key={ind}>{error}</div>
            ))}
          </div>
          <div>
             <InputField 
              size={{ m: 2, width: "30ch"}}
              setter={setUsername}
              val={username}
              label={"Username"}
              id={"standard-basic"}
              multiline={false}
              variant={"standard"}
              labelFontSize={"20px"}      
            /> 
          </div>
          <div>
            <InputField 
              size={{ m: 2, width: "30ch"}}
              setter={setFirstName}
              val={first_name}
              label={"First Name"}
              id={"standard-basic"}
              multiline={false}
              variant={"standard"}
              labelFontSize={"20px"}      
            /> 
          </div>
          <div>
            <InputField 
              size={{ m: 2, width: "30ch"}}
              setter={setLastName}
              val={last_name}
              label={"Last Name"}
              id={"standard-basic"}
              multiline={false}
              variant={"standard"}
              labelFontSize={"20px"}      
            /> 
          </div>
          <div>
            <InputField 
              size={{ m: 2, width: "30ch"}}
              setter={setEmail}
              val={email}
              label={"Email"}
              id={"standard-basic"}
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
          <div>
            <InputField 
              size={{ m: 2, width: "30ch"}}
              setter={setRepeatPassword}
              val={repeatPassword}
              label={"Repeat Password"}
              id={"standard-basic"}
              multiline={false}
              variant={"standard"}
              labelFontSize={"20px"}  
              type="password"       
            /> 
          </div>
          <div className='signup-form-btn-container'>
            <button 
              type='submit'
              className={!btnDisabled() ? "red-background-btn-container" : "red-background-btn-container-disabled"} 
              disabled={btnDisabled()}
              id="signup-btn"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpForm;
