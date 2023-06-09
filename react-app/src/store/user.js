const SET_USER = 'user/SET_USER';

const setUser = (user) => ({
    type: SET_USER,
    user
});

export const userProfileThunk = userId => async dispatch => {
    const response = await fetch(`/api/users/user_profile/${userId}`);

    if(response.ok) {
      const user = await response.json();
      dispatch(setUser(user))
    };
};

const initialState = {};

export default function userReducer(state = initialState, action) {
    switch (action.type) {
      case SET_USER:
        return action.user 
      default:
        return state;
    }
  }