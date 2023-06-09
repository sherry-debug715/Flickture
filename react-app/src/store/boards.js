import { normalization } from "./pins";

const GET_ALL_USER_BOARDS = "boards/GET_ALL_USER_BOARDS";
const GET_BOARD_DETAIL = "boards/GET_BOARD_DETAIL";
const CREATE_BOARD = "boards/CREATE_BOARD";
const EDIT_BOARD = "boards/EDIT_BOARD";
const DELETE_BOARD = "boards/DELETE_BOARD";
const REMOVE_PIN_FROM_BOARD = "boards/REMOVE_PIN_FROM_BOARD";

const removePinFromBoard = (pinId) => ({
    type: REMOVE_PIN_FROM_BOARD,
    pinId
})

const getAllUserBoards = boards => ({
    type: GET_ALL_USER_BOARDS,
    boards
});

const getBoardDetail = board => ({
    type: GET_BOARD_DETAIL,
    board
});

const createBoard = board => ({
    type: CREATE_BOARD,
    board
});

const editBoard = board => ({
    type: EDIT_BOARD,
    board
});

const deleteBoard = boardId => ({
    type: DELETE_BOARD,
    boardId
});


export const removePinFromBoardThunk = (pinId, boardId) => async dispatch => {
    const response = await fetch(`/api/boards/remove_pin_from_board/${pinId}/${boardId}`, {
        method: "DELETE"
    });

    if(response.ok) {
        dispatch(removePinFromBoard(pinId))
        return true
    };
};

export const deleteBoardThunk = boardId => async dispatch => {
    const response = await fetch(`/api/boards/delete/${boardId}`, {
        method: "DELETE"
    });

    if(response.ok) {
        dispatch(deleteBoard(boardId));
    };
};

export const editBoardThunk = (boardToEdit, boardId) => async dispatch => {

    const response = await fetch(`/api/boards/edit/${boardId}`, {
        method: "PUT",
        headers: {
            "Content-Type":"application/json",
        },
        body: JSON.stringify(boardToEdit)
    });

    if(response.ok) {
        const editedBoard = await response.json();
        dispatch(editBoard(editedBoard));
        return editedBoard;
    };
};

export const createBoardThunk = (newBoard) => async dispatch => {
    const response = await fetch("/api/boards/create", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newBoard)
    });

    if(response.ok) {
        const newBoard = await response.json();
        dispatch(createBoard(newBoard));
        return newBoard;
    };
};

export const getAllUserBoardsThunk = (userId) => async dispatch => {
    const response = await fetch(`/api/boards/user_boards/${userId}`, {
        headers: {"Content-Type":"application/json"}
    });

    if(response.ok) {
        const userBoards = await response.json();
        dispatch(getAllUserBoards(userBoards));
        return userBoards
    };
};

export const getBoardDetailThunk = boardId => async dispatch => {
    const response = await fetch(`/api/boards/${boardId}`, {
        headers: {"Content-Type":"application/json"}
    });

    if(response.ok) {
        const boardDetail = await response.json();
        dispatch(getBoardDetail(boardDetail));
        return boardDetail;
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
            return newState;
        case CREATE_BOARD:
            newState = {...state, allBoards:{...state.allBoards}};
            newState.allBoards[action.board.id] = action.board;
            return newState;
        case EDIT_BOARD:
            newState = {...state, allBoards: {...state.allBoards}}
            newState.allBoards[action.board.id] = action.board;
            return newState
        case DELETE_BOARD:
            newState = {...state, allBoards: {...state.allBoards}};
            delete newState.allBoards[action.boardId]
            return newState;
        case REMOVE_PIN_FROM_BOARD:
            newState = {...state, singleBoard:{...state.singleBoard, pins: [...state.singleBoard.pins]}};
            const removedPinIdx = newState.singleBoard.pins.findIndex(pin => pin.pin_id === action.pinId);
            if(removePinFromBoard !== -1) {
                newState.singleBoard.pins.splice(removedPinIdx, 1);
            };
            return newState;
        default:
            return state;
    };
};