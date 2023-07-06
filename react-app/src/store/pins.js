const GET_ALL_PINS = "pins/GET_ALL_PINS";
const GET_ONE_PIN = "pins/GET_ONE_PIN";
const GET_PINS_SAME_CATEGORY = "pins/GET_PINS_SAME_CATEGORY";
const EDIT_PIN = "pins/EDIT_PIN";
const DELETE_PIN = "pins/DELETE_PIN";
const GET_SAVED_PINS = "pins/GET_SAVED_PINS";
const REMOVE_SAVED_PIN = "pins/REMOVE_SAVED_PIN";
const REMOVE_SAVED_PIN_AFTER_ADD_TO_BOARD = "pins/REMOVE_SAVED_PIN_AFTER_ADD_TO_BOARD";
const CLEAR_PIN_STATE = "pins/CLEAR_PIN_STATE";
const ADD_FOLLOWER = "pins/ADD_FOLLOWER";
const REMOVE_FOLLOW = "pins/REMOVE_FOLLOW";
const GET_USER_CREATED_PINS = "pins/GET_USER_CREATED_PINS";


export const getUserCreatedPins = pins => ({
    type: GET_USER_CREATED_PINS,
    pins
});

export const removeFollow = user => ({
    type: REMOVE_FOLLOW,
    user
});

export const addFollower = (follower) => ({
    type: ADD_FOLLOWER,
    follower
});

export const clearPins = () => ({
    type: CLEAR_PIN_STATE,
  });

const removeSavedPin = pinId => ({
    type: REMOVE_SAVED_PIN,
    pinId
});

const userSavedPins = pins => ({
    type: GET_SAVED_PINS,
    pins
}); 

const deletePin = pinId => ({
    type: DELETE_PIN,
    pinId
});

const getAllPinsAction = pins => ({
    type: GET_ALL_PINS,
    pins
});

const getOnePinAction = pin => ({
    type: GET_ONE_PIN,
    pin
});

const getPinOfCategory = pins => ({
    type: GET_PINS_SAME_CATEGORY,
    pins
});

const editPin = (pin, editCreatedPin) => ({
    type: EDIT_PIN,
    pin,
    editCreatedPin
});



const removeSavedPinAfterAddToBoard = savedId => ({
    type: REMOVE_SAVED_PIN_AFTER_ADD_TO_BOARD,
    savedId
})

export const getUserCreatedPinsThunk = userId => async dispatch => {
    const response = await fetch(`/api/pins/user_created/${userId}`);

    if(response.ok) {
        const createdPins = await response.json();
        dispatch(getUserCreatedPins(createdPins));
    };
};

export const removeSavedPinThunk = pinId => async dispatch => {
    const response = await fetch(`/api/pins/remove_saved_pin/${pinId}`, {
        headers: {"Content-Type": "application/json"},
        method: "DELETE"
    });

    if(response.ok) {
        const oldSavedPin = await response.json();
        dispatch(removeSavedPin(oldSavedPin.id));
        return oldSavedPin;
    }
};

export const savePinThunk = pinId =>  async dispatch => {
    const response = await fetch(`/api/pins/save_pin/${pinId}`, {
        headers: {"Content-Type": "application/json"},
        method: "POST"
    });

    if(response.ok) return true;
};

export const getUserSavedPinsThunk = userId => async dispatch => {
    const response = await fetch(`/api/pins/all_pins/saved/${userId}`)

    if(response.ok) {
        const savedPins = await response.json();
        dispatch(userSavedPins(savedPins));
    };
};

export const deletePinThunk = (pinId) => async dispatch => {
    const response = await fetch(`/api/pins/delete/${pinId}`, {
        headers: {"Content-Type": "application/json"},
        method: "DELETE"
    });

    if(response.ok) {
        dispatch(deletePin(pinId));
        return true;   
    };

    return response;
};

export const editPinThunk = (pinId, editedPin) => async dispatch => {
    const response = await fetch(`/api/pins/edit/${pinId}`, {
        headers: {"Content-Type": "application/json"},
        method: "PUT",
        body: JSON.stringify(editedPin)
    });

    if(response.ok) {
        const pin = await response.json();
        const editedPinToUpdatedCreatedPin = {id: pin.id, image_url:pin.pin_images[0].image_url, title: pin.title}
        dispatch(editPin(pin, editedPinToUpdatedCreatedPin));
        return pin;
    };
};

export const getPinsOfCategory = (pinId, page) => async dispatch => {
    const response = await fetch(`/api/pins/same_categories/${pinId}?page=${page}`, {
        headers: {"Content-Type":"application/json"}
    });

    if(response.ok) {
        const allPins = await response.json();
        dispatch(getPinOfCategory(allPins));
    };
};

export const getOnePinThunk = (pinId) => async dispatch => {

    const response = await fetch(`/api/pins/${pinId}`, {
        headers: {"Content-Type":"application/json"}
    });

    if(response.ok) {
        const singlePin = await response.json();
        dispatch(getOnePinAction(singlePin));
        return singlePin;
    };    
};

export const getAllPinsThunk = (page, searchQuery="") => async dispatch => {

    let url;
    if(process.env.NODE_ENV === "production") {
        url = `https://flickture-b5784f016188.herokuapp.com/api/pins?page=${page}&search=${encodeURIComponent(searchQuery)}`
    } else {
        url = `/api/pins?page=${page}&search=${encodeURIComponent(searchQuery)}`
    };
    console.log("url", url)
    const response = await fetch(url, {
        headers: {"Content-Type": "application/json"}
    });

    if(response.ok){
        const allPins = await response.json();
        dispatch(getAllPinsAction(allPins));
    };
};

export const createPinAndImageThunk = data => async dispatch => {

    const {imageFile, title, description, selectedBoardId} = data;
    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("selectedBoardId", selectedBoardId);

    const response = await fetch("/api/pins/create", {
        method: "POST",
        body: formData,
    });

    if(response.ok) {
        const newPin = await response.json();

        return newPin;
    }
};

export const savePinToBoardThunk = (pinId, boardId, savedPinId) => async dispatch => {
    const response = await fetch(`/api/boards/add_pin_to_board/${pinId}/${boardId}`, {
        method: "POST"
    });

    if(response.ok) dispatch(removeSavedPinAfterAddToBoard(savedPinId));
};

export const savePinToBoardNoRemovalThunk = (pinId, boardId) => async dispatch => {
    const response = await fetch(`/api/boards/add_pin_to_board/${pinId}/${boardId}`, {
        method: "POST"
    });

    if(response.ok) return true;
};

export const normalization = (arr) => {
    const normalized = {};
    arr.forEach(obj => normalized[obj.id] = obj);
    return normalized;
};

const initialState = {allPins:{pins: {}, totalPages: 1}, singlePin:{}, pinsOfCategory: {pins:{}, totalPages: 1}, savedPins:{}, createdPins: {}};

export default function pinReducer(state = initialState, action) {
    let newState;
    switch(action.type) {
        case GET_USER_CREATED_PINS:
            newState = {...state, createdPins:{}};
            newState.createdPins = normalization(action.pins);
            return newState;
        case GET_ALL_PINS:
            newState = {...state, allPins:{...state.allPins}};
            const pins =  {...newState.allPins.pins, ...normalization(action.pins.pins)};
            const totalPages = action.pins.pages;
            newState.allPins.pins = pins;
            newState.allPins.totalPages = totalPages;
            return newState;
        case GET_ONE_PIN:
            newState={...state, singlePin:{}};
            newState.singlePin = action.pin;
            return newState;
        case DELETE_PIN:
            newState = { ...state, createdPins:{...state.createdPins}};
            delete newState.createdPins[action.pinId];
            return newState;
        case GET_PINS_SAME_CATEGORY:
            newState = {...state, pinsOfCategory:{...state.pinsOfCategory}};
            const getPinsOfCategory =  {...newState.pinsOfCategory.pins, ...normalization(action.pins.pins)};
            const allPages = action.pins.total_pages;
            newState.pinsOfCategory.pins = getPinsOfCategory;
            newState.pinsOfCategory.totalPages = allPages;
            return newState;
        case EDIT_PIN:
            newState = {...state, singlePin: {}, createdPins:{...state.createdPins}};
            newState.singlePin = action.pin;
            newState.createdPins[action.pin.id] = action.editCreatedPin;
            return newState;
        case GET_SAVED_PINS:
            newState = {...state, savedPins: {}};
            newState.savedPins = normalization(action.pins);
            return newState;
        case REMOVE_SAVED_PIN:
            newState = {...state, savedPins: {...state.savedPins}};
            delete newState.savedPins[action.pinId];
            return newState
        case REMOVE_SAVED_PIN_AFTER_ADD_TO_BOARD:
            newState = {...state, savedPins: {...state.savedPins}};
            delete newState.savedPins[action.savedId];
            return newState
        case ADD_FOLLOWER:
            newState = {...state, singlePin: {...state.singlePin, followers: [...state.singlePin.followers]}};
            const findIdx1 = newState.singlePin.followers.findIndex(user => user.id === action.follower.id);
            if(findIdx1 === -1) {
                newState.singlePin.followers.push(action.follower);
                return newState;
            } else return state;
        case REMOVE_FOLLOW:
            newState = {...state, singlePin: {...state.singlePin, followers: [...state.singlePin.followers]}};
            newState.singlePin.followers = newState.singlePin.followers.filter(user => user.id !== action.user.id);
            return newState;
        case CLEAR_PIN_STATE:
            newState = {...state, allPins:{pins: {}, totalPages: 1}}
            return newState
        default:
            return state;
    };
};