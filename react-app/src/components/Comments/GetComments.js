import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getCommentsThunk } from "../../store/comments";
import CommentCard from "./CommentCard";
import "./comments.css";

export default function GetComments({pinId}) {

    const dispatch = useDispatch();

    const allComments = useSelector(state => state.comments);

    useEffect(() => {
        dispatch(getCommentsThunk(pinId));
    }, [dispatch]);

    const commentsArr = Object.values(allComments);

    const sortCommentsArr = commentsArr.sort((a, b) => {
        const dateA = Date.parse(a.created_at);
        const dateB = Date.parse(b.created_at);
        return dateB - dateA;
    });

    if(!commentsArr.length) return null;


    return (
        <div className="all-comments-container">
            {sortCommentsArr.map(comment => (
                <div className="each-comment-container" key={comment.id}>
                    <CommentCard comment={comment} />
                </div>
            ))}
        </div>
    )
};