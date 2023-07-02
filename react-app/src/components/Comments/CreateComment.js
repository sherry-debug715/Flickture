import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createCommentThunk, getCommentsThunk } from "../../store/comments";
import { getOnePinThunk } from "../../store/pins";
import EmojiPicker, {
    EmojiStyle,
    Emoji
  } from "emoji-picker-react";

export default function CreateCommentForm({pinId, containerRef}) {
    
    const dispatch = useDispatch();

    const sessionUser = useSelector(state => state.session.user);

    const allComments = useSelector(state => state.comments);

    useEffect(() => {
        dispatch(getCommentsThunk(pinId));
    }, [dispatch]);

    const commentsArr = Object.values(allComments);

    const [content, setContent] = useState("");

    const textAreaRef = useRef(null);

    const [emojiOpen, setEmojiOpen] = useState(false);

    const openEmoji = () => {
        if(emojiOpen) return;
        setEmojiOpen(true);
    };

    useEffect(() => {
        if(!emojiOpen) return;

        const closeEmoji = () => {
            setEmojiOpen(false);
        };

        document.addEventListener("click", closeEmoji);

        return () => document.removeEventListener("click", closeEmoji);
    },[emojiOpen]);

    useEffect(() => {
        if (textAreaRef.current  && containerRef.current) {
            textAreaRef.current.style.height = "auto";
            textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;

            if (content.length > 167) {
                containerRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
            }
        }
    }, [content]); 

    const handleSubmit = async() => {
        const data = {content};

        if(!buttonDisabled()) {
            const newComment = await dispatch(createCommentThunk(pinId, data));
            if(newComment){ 
                setContent("");
                dispatch(getOnePinThunk(pinId));
            };
        };
    };

    const userAlreadyLeftComment = commentsArr.map(comment => comment.creator.id);

    const buttonDisabled = () => {
        if(!content.length || !sessionUser) return true;
        if(sessionUser && userAlreadyLeftComment.includes(sessionUser.id)) return true; 
    };

    if(sessionUser && userAlreadyLeftComment.includes(sessionUser.id)) return null;

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
                    <div onClick={openEmoji} style={{cursor: "pointer"}}>
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
                <button 
                className={!buttonDisabled() ? "create-comment-btn-container" : "create-comment-btn-container-disabled"}
                disabled={buttonDisabled()}
                onClick={handleSubmit}                
                >
                    <span 
                        className="material-symbols-outlined"
                        id="material-symbols-send"
                    >
                        send
                    </span>
                </button>                 
            </div>

        </div>
    )

};
