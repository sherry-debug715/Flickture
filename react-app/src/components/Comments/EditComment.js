import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import EmojiPicker, {
    EmojiStyle,
    Emoji
  } from "emoji-picker-react";
import { editCommentThunk } from "../../store/comments";
import GreyBackgroundBtn from "../ui/Buttons/greyBackgroundBtn";
import RedBackgroundBtn from "../ui/Buttons/RedBackgroundBtn";

export default function EditComment({content, setContent, setShowEditForm, commentId, pinId}) {

    const dispatch = useDispatch();

    const [originalContent, setOriginalContent] = useState("");

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

    const textAreaRef = useRef(null);

    useEffect(() => setOriginalContent(content), []);

    useEffect(() => {
        if (textAreaRef.current) {
            requestAnimationFrame(() => {
                textAreaRef.current.style.height = "auto";
                textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
            });
        }
    }, [content]); 

    const handleSave = async() => {
        const editedContent = {"content": content}
        const editedComment = await dispatch(editCommentThunk(pinId, commentId, editedContent));
        if(editedComment) setShowEditForm(false);
    };

    const buttonDisabled = () => content === originalContent || !content.length;

    return (
        <div className="edit-comment-container">
            <div className="edit-comment-content-container">
                <textarea 
                    ref={textAreaRef}
                    type="text"
                    value={content}
                    spellCheck="true"
                    onChange={e => setContent(e.target.value)}
                    className="edit-comment-textarea"
                />

                <div className="edit-comment-emoji-container">
                    <div onClick={openEmoji} style={{cursor: "pointer"}}>
                        <Emoji unified="1f603" size={22} />
                    </div>

                    <div className="edit-comment-emoji-picker-container">
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
            </div>

            <div className="edit-comment-btn-container">
                <GreyBackgroundBtn 
                    text={"Cancel"}
                    onClick={() => setShowEditForm(false)}
                />
                <RedBackgroundBtn
                    text={"Save"}
                    disabled={buttonDisabled}
                    onClick={handleSave}
                />
            </div>
        </div>
    )
};