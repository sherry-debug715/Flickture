import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import NavBar from './components/Navigation/NavBar';
import Landing from './components/Landing';
import ProtectedRoute from './components/auth/ProtectedRoute';
import UsersList from './components/UsersList';
import User from './components/User';
import GetAllPins from './components/pins/getPins/GetAllPins';
import SinglePin from './components/pins/getSinglePin';
import CreatePin from './components/pins/createPin';
import UserProfile from './components/UserProfile';
import { authenticate } from './store/session';
import BoardPins from './components/Boards';
import EditBoardForm from './components/Boards/editBoard';

function App() {
  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();
  const [searchContent, setSearchContent] = useState("");


  useEffect(() => {
    (async() => {
      await dispatch(authenticate());
      setLoaded(true);
    })();
  }, [dispatch]);

  if (!loaded) {
    return null;
  }

  return (
    <BrowserRouter>
      <NavBar setSearchContent={setSearchContent} searchContent={searchContent} />
      <Switch>
        <Route path='/' exact={true} >
          <Landing />
        </Route>
        <Route path="/userProfile/:userId" exact={true}>
          <UserProfile />
        </Route>
        <Route path='/explore' exact={true} >
          <GetAllPins searchContent={searchContent} />
        </Route>
        <Route path='/explore/:pinId' exact={true} >
          <SinglePin />
        </Route>
        <Route path='/pin/create' exact={true} >
          <CreatePin />
        </Route>
        <Route path='/boards/:boardId' exact={true} >
          <BoardPins />
        </Route>
        <Route path='/boards/edit/:boardId' exact={true} >
          <EditBoardForm />
        </Route>
        <ProtectedRoute path='/users' exact={true} >
          <UsersList/>
        </ProtectedRoute>
        <ProtectedRoute path='/users/:userId' exact={true} >
          <User />
        </ProtectedRoute>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
