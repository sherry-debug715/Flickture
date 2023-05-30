const GET_ALL_PINS = "pins/GET_ALL_PINS"

const getAllPins = pins => ({
    type: GET_ALL_PINS,
    pins
});

export const getAllPinsThunk = (page) => async dispatch => {
    const response = await fetch(`/api/pins?page=${page}`, {
        headers: {"Content-Type": "application/json"}
    });

    if(response.ok){
        const allPins = await response.json();
        dispatch(getAllPins(allPins));
    };
};

const normalization = (arr) => {
    const normalized = {};
    arr.forEach(obj => normalized[obj.id] = obj);
    return normalized;
};

const initialState = {allPins:{pins: {}, totalPages: 1}, singlePin:{}};

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
        default:
            return state;
    };
};