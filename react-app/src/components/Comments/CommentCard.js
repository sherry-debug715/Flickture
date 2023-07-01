import "./comments.css";

export default function CommentCard({comment}) {
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
                <div>
                    {comment.content}
                </div>
                <div>
                    {convertDate(comment.created_at)}
                </div>
            </div>
        </div>
    )
};