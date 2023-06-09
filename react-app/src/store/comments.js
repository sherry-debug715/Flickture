import { normalization } from "./pins";
const CREATE_COMMENT = "comments/CREATE_COMMENT";
const GET_COMMENTS = "comments/GET_COMMENTS";
const EDIT_COMMENT = "comments/EDIT_COMMENT";
const DELETE_COMMENT = "comments/DELETE_COMMENT";

const deleteComment = commentId => ({
    type: DELETE_COMMENT,
    commentId
});

const editComment = editedComment => ({
    type: EDIT_COMMENT,
    editedComment
});

const createComment = newComment => ({
    type: CREATE_COMMENT,
    newComment
});

const getComments = comments => ({
    type:GET_COMMENTS,
    comments
});


export const deleteCommentThunk = (pinId, commentId) => async dispatch => {
    const response = await fetch(`/api/comments/delete/${pinId}/${commentId}`, {
        method: "DELETE"
    });

    if(response.ok) {
        dispatch(deleteComment(commentId));
    }
};

export const editCommentThunk = (pinId, commentId, content) => async dispatch => {
    const response = await fetch(`/api/comments/edit/${pinId}/${commentId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(content)
    });

    if(response.ok) {
        const editedComment = await response.json();
        dispatch(editComment(editedComment));
        return editedComment;
    }
};

export const getCommentsThunk = (pinId) => async dispatch => {
    const response = await fetch(`/api/comments/all/${pinId}`);

    if(response.ok) {
        const allComments = await response.json();
        dispatch(getComments(allComments));
    }
};

export const createCommentThunk = (pinId, content) => async dispatch => {
    const response = await fetch(`/api/comments/create/${pinId}`, {
        method:"POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(content)
    });

    if(response.ok) {
        const newComment = await response.json();
        dispatch(createComment(newComment));
        return newComment;
    };
};


const initialState = {};

export default function commentsReducer(state = initialState, action) {
    let newState;
    switch(action.type) {
        case CREATE_COMMENT:
            newState = {...state};
            newState[action.newComment.id] = action.newComment;
            return newState; 
        case GET_COMMENTS:
            newState={};
            newState = normalization(action.comments);
            return newState;
        case EDIT_COMMENT:
            newState={...state};
            newState[action.editedComment.id] = action.editedComment;
            return newState;
        case DELETE_COMMENT:
            newState={...state};
            delete newState[action.commentId];
            return newState
        default:
            return state;
    };
};