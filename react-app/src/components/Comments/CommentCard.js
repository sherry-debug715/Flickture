import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import EditComment from "./EditComment";
import { deleteCommentThunk } from "../../store/comments";
import { getOnePinThunk } from "../../store/pins";
import "./comments.css";

export default function CommentCard({comment}) {

    const [isExpanded, setIsExpanded] = useState(false);

    const dispatch = useDispatch();

    const [showEditForm, setShowEditForm] = useState(false);

    const [content, setContent] =  useState("");
    
    const sessionUser = useSelector(state => state.session.user);

    const convertDate = dateString => {

        const date = new Date(dateString);

        const dateWithoutTime = date.toDateString();

        return dateWithoutTime;
    };
    const showEditDelete = () => sessionUser && sessionUser.id === comment.creator.id;

    if(showEditForm) return <EditComment content={content} setContent={setContent} setShowEditForm={setShowEditForm} commentId={comment.id} pinId={comment.pin_id} />

    else return (
        <div className="comment-card-container">
            <div className="comment-user-container">
                {
                comment.creator.profile_url ? 
                <img src={comment.creator.profile_url} alt="user" className="comment-user-profile" /> : 
                <div className="comment-user-profile">
                    {comment.creator.username[0]}
                </div>
                }
                <div className="comment-username">
                    {comment.creator.username}
                </div>
            </div>

            <div className="comment-content-container">
                <div className={`comment-content ${isExpanded ? 'expanded': 'collapsed'}`}>
                    {isExpanded ? comment.content : comment.content.slice(0, 100)} <br />
                    {
                        comment.content.length > 100 && 
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="comment-card-expand-option"
                        >
                            {isExpanded ? 'Less' : 'More'}
                        </button>
                    }
                </div>
               {showEditDelete() && <div className="comment-date-edit-container">
                    <div>{convertDate(comment.created_at)}</div>
                    <div 
                        className="comment-edit-icon-container"
                        onClick={() => {
                            setShowEditForm(true)
                            setContent(comment.content)
                        }}
                    >
                        <span 
                            className="material-symbols-outlined"
                            id="material-symbols-outlined-edit"
                        >
                            edit
                        </span>
                    </div>
                    <div 
                        className="comment-edit-icon-container"
                        onClick={() => {
                            dispatch(deleteCommentThunk(comment.pin_id, comment.id))
                            .then(() => dispatch(getOnePinThunk(comment.pin_id)))
                        }}
                    >
                        <span 
                            className="material-symbols-outlined"
                            id="material-symbols-outlined-edit"
                        >
                            delete
                        </span>
                    </div>
                </div>}
            </div>
        </div>
    )
};