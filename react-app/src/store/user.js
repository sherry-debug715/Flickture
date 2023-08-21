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

export const editUserProfileThunk = (userId, editedUser) => async dispatch => {
  const { first_name, last_name, username, email, imageFile } = editedUser;

  const formData = new FormData();
  formData.append("first_name", first_name);
  formData.append("last_name", last_name);
  formData.append("username", username);
  formData.append("email", email);
  if (imageFile) formData.append("image", imageFile);

  const response = await fetch(`/api/user_profile/edit/${userId}`, {
    method: "PATCH",
    body: FormData
  });

  if (response.ok) return true;
  
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