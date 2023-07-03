import React from 'react';
import { useState, useEffect } from 'react';
import { NavLink, Link, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import LogoutButton from '../auth/LogoutButton';
import LoginForm from '../auth/LoginForm';
import SignUpForm from '../auth/SignUpForm';
import OpenModalButton from '../OpenModalButton';
import { getAllPinsThunk } from '../../store/pins';
import { clearPins } from '../../store/pins';
import "./navBar.css";


const NavBar = ({setSearchContent, searchContent}) => {

  const [showMenu, setShowMenu] = useState(false);

  const dispatch = useDispatch();

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

  let sessionContent;
  if(sessionUser) {
    sessionContent = (
    <div className='profile-dropdown' onClick={openMenu}>
      {sessionUser.profile_url ? <img src={sessionUser.profile_url} className='profile-image' alt="profile" /> : <div className='profile-image'>{sessionUser.first_name[0]}</div>}
      {showMenu && (
        <div className='profile-drop-down-container'>
          <Link to={`/userProfile/${sessionUser.id}`}>user profile</Link>
          <div><LogoutButton /></div>
        </div>
      )}
    </div>  
    )
  } else {
    sessionContent = (
      <ul className='logIn-signUp-container'>
        <li className='auth-container'>
          <OpenModalButton buttonText="Log in" modalComponent={<LoginForm handleNavToHome={handleNavToHome} />} />
        </li>
        <li className='auth-container'>
          <OpenModalButton buttonText="Sign up" modalComponent={<SignUpForm  handleNavToHome={handleNavToHome} />} />
        </li>
      </ul>
    )
  };

  const handleSearch = () => {
    dispatch(clearPins())
    dispatch(getAllPinsThunk(1, searchContent))
    .then(() => history.push("/explore"))
  };

  return (
    <div className='navBar-container'>
      <nav className='navBar-inner-container'>
        <div className='navBar-logo-container'>      
            <NavLink 
              to='/explore' 
              exact={true} 
              activeClassName='active'
              id="logo"
            >
              <span>f</span>
              <span>l</span>
              <span>ickture</span>
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
            value={searchContent}
            onChange={e => setSearchContent(e.target.value)}
            onKeyDown={e => {
              if(e.key === "Enter") return handleSearch();
            }}
          />
        
        </div>
        <div>{sessionContent}</div>
      </nav>
    </div>
  );
}

export default NavBar;
