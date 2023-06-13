import { normalization } from "./pins";

const GET_ALL_USER_BOARDS = "boards/GET_ALL_USER_BOARDS";
const GET_BOARD_DETAIL = "boards/GET_BOARD_DETAIL";

const getAllUserBoards = boards => ({
    type: GET_ALL_USER_BOARDS,
    boards
});

const getBoardDetail = board => ({
    type: GET_BOARD_DETAIL,
    board
});

export const getAllUserBoardsThunk = () => async dispatch => {
    const response = await fetch("/api/boards/user_boards", {
        headers: {"Content-Type":"application/json"}
    });

    if(response.ok) {
        const userBoards = await response.json();
        dispatch(getAllUserBoards(userBoards));
    };
};

export const getBoardDetailThunk = boardId => async dispatch => {
    const response = await fetch(`/api/boards/${boardId}`, {
        headers: {"Content-Type":"application/json"}
    });

    if(response.ok) {
        const boardDetail = await response.json();
        dispatch(getBoardDetail(boardDetail));
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
        case GET_BOARD_DETAIL:
            newState = {...state, singleBoard:{}};
            newState.singleBoard = action.board;
            return newState
        default:
            return state;
    };
};