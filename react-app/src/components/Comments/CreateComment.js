import { useState, useRef, useEffect } from "react";
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

    const buttonDisabled = () => !content.length;

    useEffect(() => {
        if (textAreaRef.current) {
            textAreaRef.current.style.height = "auto";
            textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
        }
    }, [content]); 

    return (
        <div className="create-comment-container">
            <div>
                {sessionUser.profile_url ? <img src={sessionUser.profile_url} alt="user" className="create-comment-user-profile" /> : <div className="create-comment-user-profile">{sessionUser.username[0]}</div>}
            </div>

            <div className="create-comment-textarea-container">
                <textarea 
                    ref={textAreaRef}
                    type="text"
                    placeholder="Add a comment"
                    spellCheck="true"
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    className="create-comment-textarea"
                />
                <div className="create-comment-emoji-container">
                    <div onClick={() => setEmojiOpen(prev => !prev)} style={{cursor: "pointer"}}>
                        <Emoji unified="1f603" size={22} />
                    </div>

                    <div className="create-comment-emoji-picker-container">
                        { emojiOpen && <EmojiPicker
                            onEmojiClick={(emojiData) => {
                                const emoji = String.fromCodePoint(parseInt(emojiData.unified, 16));
                                setContent(prev => prev + emoji);
                            }}
                            autoFocusSearch={false}
                            emojiStyle={EmojiStyle.NATIVE}
                        
                        /> }
                    </div>
                </div>   
                <div className="create-comment-btn-container">
                    <span 
                        className="material-symbols-outlined"
                        id="material-symbols-send"
                    >
                        send
                    </span>
                </div>                 
            </div>

        </div>
    )

};
