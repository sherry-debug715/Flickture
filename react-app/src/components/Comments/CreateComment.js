import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createCommentThunk } from "../../store/comments";
import EmojiPicker, {
    EmojiStyle,
    Emoji
  } from "emoji-picker-react";

export default function CreateCommentForm({pinId}) {
    
    const dispatch = useDispatch();

    const sessionUser = useSelector(state => state.session.user);

    const [content, setContent] = useState("");

    const textAreaRef = useRef(null);

    const [emojiOpen, setEmojiOpen] = useState(false);

    return (
        <div className="create-comment-container">
            <div className="create-comment-user-profile">
                
            </div>

        </div>
    )

};
