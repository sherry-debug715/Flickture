const GET_ALL_PINS = "pins/GET_ALL_PINS";
const GET_ONE_PIN = "pins/GET_ONE_PIN";
const GET_PINS_SAME_CATEGORY = "pins/GET_PINS_SAME_CATEGORY";

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
    console.log("I'm invoked")
    const response = await fetch(`/api/pins/${pinId}`, {
        headers: {"Content-Type":"application/json"}
    });

    if(response.ok) {
        const singlePin = await response.json();
        dispatch(getOnePinAction(singlePin));
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

const normalization = (arr) => {
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
        default:
            return state;
    };
};