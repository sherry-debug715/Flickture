import { useState } from "react";
import "./comments.css";

export default function CommentCard({comment}) {

    const [isExpanded, setIsExpanded] = useState(false);

    const convertDate = dateString => {

        const date = new Date(dateString);

        const dateWithoutTime = date.toDateString();

        return dateWithoutTime;
    };

    return (
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
                <div>
                    {convertDate(comment.created_at)}
                </div>
            </div>
        </div>
    )
};