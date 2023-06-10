import React from 'react';
import { useState, useEffect } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LogoutButton from '../auth/LogoutButton';
import LoginForm from '../auth/LoginForm';
import SignUpForm from '../auth/SignUpForm';
import OpenModalButton from '../OpenModalButton';
import "./navBar.css";


const NavBar = () => {
  const [showMenu, setShowMenu] = useState(false);

  const openMenu = () => {
      if (showMenu) return;
      setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = () => {
      setShowMenu(false);
    };

    document.addEventListener('click', closeMenu);
  
    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const sessionUser = useSelector(state => state.session.user);

  const history = useHistory();

  const handleNavToHome = () => history.push("/explore");

  const dropDown = (
    <div className='profile-drop-down-container'>
      <div>user profile</div>
      <div><LogoutButton /></div>
    </div>
  );

  let sessionContent;
  if(sessionUser) {
    sessionContent = (
    <div className='profile-dropdown' onClick={openMenu}>
      {sessionUser.profile_url ? <img src={sessionUser.profile_url} className='profile-image' alt="profile" /> : <div className='profile-image'>{sessionUser.first_name[0]}</div>}
      {showMenu && dropDown}
    </div>  
    )
  } else {
    sessionContent = (
      <ul className='logIn-signUp-container'>
        <li>
          <OpenModalButton buttonText="Log in" modalComponent={<LoginForm handleNavToHome={handleNavToHome} />} />
        </li>
        <li>
          <OpenModalButton buttonText="Sign up" modalComponent={<SignUpForm  handleNavToHome={handleNavToHome} />} />
        </li>
      </ul>
    )
  };



  return (
    <div className='navBar-container'>
      <nav className='navBar-inner-container'>
        <div className='navBar-logo-container'>      
            <NavLink 
              to='/' 
              exact={true} 
              activeClassName='active'
              id="logo"
            >
              flickture
            </NavLink>                
        </div>
        {sessionUser && 
        <div 
        className='createPin-link'
        onClick={() => history.push("/pin/create")}
        >
          Create Pin
        </div>}
        <div className='searchBar'>
          <input 
          type="search" 
          placeholder='Search'
          />
        </div>
        <div>{sessionContent}</div>
      </nav>
    </div>
  );
}

export default NavBar;
