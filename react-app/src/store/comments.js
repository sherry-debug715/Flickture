import { normalization } from "./pins";
const CREATE_COMMENT = "comments/CREATE_COMMENT";
const GET_COMMENTS = "comments/GET_COMMENTS";

const createComment = newComment => ({
    type: CREATE_COMMENT,
    newComment
});

const getComments = comments => ({
    type:GET_COMMENTS,
    comments
});

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
    };
};


const initialState = {};

export default function commentsReducer(state = initialState, action) {
    let newState;
    switch(action.type) {
        case CREATE_COMMENT:
            newState = {...state};
            newState[action.newComment.id] = newComment;
            return newState; 
        case GET_COMMENTS:
            newState={};
            newState = normalization(action.comments);
            return newState;
    };
};