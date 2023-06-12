import { normalization } from "./pins";

const GET_ALL_USER_BOARDS = "boards/GET_ALL_USER_BOARDS";

const getAllUserBoards = boards => ({
    type: GET_ALL_USER_BOARDS,
    boards
});

export const getAllUserBoardsThunk = () => async dispatch => {
    const response = await fetch("/api/boards/user_boards", {
        headers: {"Content-Type":"application/json"}
    });

    if(response.ok) {
        const userBoards = await response.json();
        console.log("userBoards",userBoards)
        dispatch(getAllUserBoards(userBoards));
    };
};



const initialState = {allBoards: {}, singleBoard:{}};

export default function boardReducer(state = initialState, action) {
    let newState;
    switch(action.type) {
        case GET_ALL_USER_BOARDS:
            newState = {...state, allBoards:{}};
            newState.allBoards = normalization(action.boards);
            return newState;
        default:
            return state;
    };
};