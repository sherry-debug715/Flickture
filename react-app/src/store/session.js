// constants
const SET_USER = 'session/SET_USER';
const REMOVE_USER = 'session/REMOVE_USER';
const FOLLOW_USER = 'session/FOLLOW_USER';
const UNFOLLOW_USER = 'session/UNFOLLOW_USER';

const followUser = user => ({
  type: FOLLOW_USER,
  user
});

const unfollowUser = user => ({
  type: UNFOLLOW_USER,
  user
});

const setUser = (user) => ({
  type: SET_USER,
  payload: user
});

const removeUser = () => ({
  type: REMOVE_USER,
});

export const unfollowUserThunk = (userId, user) => async dispatch => {
  const response = await fetch(`/api/users/unfollow/${userId}`, {
    method: 'POST'
  });

  if(response.ok) {
    const sessionUser = await response.json();
    dispatch(unfollowUser(user));
    return sessionUser;
  };
};

export const followUserThunk = (userId, user) => async dispatch => {
  console.log("user===from thunk", user)
  const response = await fetch(`/api/users/follow/${userId}`, {
    method: 'POST'
  });

  if(response.ok) {
    const followedUser = await response.json();
    dispatch(followUser(user));
    return followedUser;
  }
};


export const authenticate = () => async (dispatch) => {
  const response = await fetch('/api/auth/', {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (response.ok) {
    const data = await response.json();
    if (data.errors) {
      return;
    }
  
    dispatch(setUser(data));
  }
}

export const login = (email, password) => async (dispatch) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email,
      password
    })
  });
  
  
  if (response.ok) {
    const data = await response.json();
    dispatch(setUser(data))
    return null;
  } else if (response.status < 500) {
    const data = await response.json();
    if (data.errors) {
      return data.errors;
    }
  } else {
    return ['An error occurred. Please try again.']
  }

}

export const logout = () => async (dispatch) => {
  const response = await fetch('/api/auth/logout', {
    headers: {
      'Content-Type': 'application/json',
    }
  });

  if (response.ok) {
    dispatch(removeUser());
  }
};


export const signUp = (username, email, password, first_name, last_name) => async (dispatch) => {
  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
      email,
      password,
      first_name,
      last_name
    }),
  });
  
  if (response.ok) {
    const data = await response.json();
    dispatch(setUser(data))
    return null;
  } else if (response.status < 500) {
    const data = await response.json();
    if (data.errors) {
      return data.errors;
    }
  } else {
    return ['An error occurred. Please try again.']
  }
}

const initialState = { user: null };

export default function reducer(state = initialState, action) {
  let newState;
  switch (action.type) {
    case SET_USER:
      return { user: action.payload }
    case REMOVE_USER:
      return { user: null }
    case FOLLOW_USER:
      newState = {user: {...state.user, following: [...state.user.following]}};
      newState.user.following.push(action.user);
      return newState;
    case UNFOLLOW_USER:
      newState = { user: {...state.user, following: [...state.user.following]}};
      newState.user.following = newState.user.following.filter(user => user.id !== action.user.id)
      // const userIdx = newState.user.following.findIndex(user => user.id === action.user.id);
      // if(userIdx) newState.user.following.splice(userIdx, 1);
      return newState;
    default:
      return state;
  }
}
