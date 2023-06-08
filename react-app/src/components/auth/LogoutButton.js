import React from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/session';
import { useHistory } from 'react-router-dom';

const LogoutButton = () => {
  const dispatch = useDispatch()

  const history = useHistory();

  const onLogout = async (e) => {
    dispatch(logout());
    history.push("/");
  };

  return <div onClick={onLogout}>Logout</div>;
};

export default LogoutButton;
