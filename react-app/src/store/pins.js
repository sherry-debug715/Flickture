const GET_ALL_PINS = "pins/GET_ALL_PINS";
const GET_ONE_PIN = "pins/GET_ONE_PIN";
const GET_PINS_SAME_CATEGORY = "pins/GET_PINS_SAME_CATEGORY";
const EDIT_PIN = "pins/EDIT_PIN";


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

const editPin = pin => ({
    type: EDIT_PIN,
    pin
});

export const editPinThunk = (pinId, editedPin) => async dispatch => {
    const response = await fetch(`/api/pins/edit/${pinId}`, {
        headers: {"Content-Type": "application/json"},
        method: "PUT",
        body: JSON.stringify(editedPin)
    });

    if(response.ok) {
        const pin = await response.json();
        dispatch(editPin(pin));
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

export const getAllPinsThunk = (page) => async dispatch => {
    const response = await fetch(`/api/pins?page=${page}`, {
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

export const normalization = (arr) => {
    const normalized = {};
    arr.forEach(obj => normalized[obj.id] = obj);
    return normalized;
};

const initialState = {allPins:{pins: {}, totalPages: 1}, singlePin:{}, pinsOfCategory: {pins:{}, totalPages: 1}};

export default function pinReducer(state = initialState, action) {
    let newState;
    switch(action.type) {
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
        case GET_PINS_SAME_CATEGORY:
            newState = {...state, pinsOfCategory:{...state.pinsOfCategory}};
            const getPinsOfCategory =  {...newState.pinsOfCategory.pins, ...normalization(action.pins.pins)};
            const allPages = action.pins.total_pages;
            newState.pinsOfCategory.pins = getPinsOfCategory;
            newState.pinsOfCategory.totalPages = allPages;
            return newState;
        case EDIT_PIN:
            newState = {...state, singlePin: {}};
            newState.singlePin = action.pin;
            return newState;
        default:
            return state;
    };
};