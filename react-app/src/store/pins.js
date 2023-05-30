GET_ALL_PINS = "pins/GET_ALL_PINS"

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
        dispatch(getAllPins(allPins.pins));
    };
};

const normalization = (arr) => {
    const normalized = {};
    arr.forEach(obj => normalized[obj.id] = obj);
    return normalized;
};

const initialState = {allPins:{}, singlePin:{}};

export default function pinReducer(state = initialState, action) {
    let newState;
    switch(action.type) {
        case GET_ALL_PINS:
            newState = {...state};
            newState.allPins = {...newState.allPins,...normalization(action.pins)};
            return newState;
    };
};