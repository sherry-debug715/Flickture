import { useState, useCallback, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {useDropzone} from 'react-dropzone';
import { useHistory } from "react-router-dom";
import RedBackgroundBtn from "../../ui/Buttons/RedBackgroundBtn";
import "../pins.css";
import { createPinAndImageThunk } from "../../../store/pins";
import SavePinToBoard from "../../SavePinToBoard";

import EmojiPicker, {
    EmojiStyle,
    Emoji,
    EmojiClickData,
  } from "emoji-picker-react";

export default function CreatePin() {
    const [imageFile, setImageFile] = useState();
    const [imageUrl, setImageUrl] = useState("")
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [textAreaId, setTextAreaId] = useState("about-pin-input");
    const [textCount, setTextCount] = useState(0);
    const textAreaRef = useRef(null);
    const [emojiOpen, setEmojiOpen] = useState(false);
    const history = useHistory();
    const dispatch = useDispatch();
    const sessionUser = useSelector(state => state.session.user);

    const handleSubmit = async(e) => {
        e.preventDefault();
        const data = {
            imageFile,
            title,
            description
        };
        const newPin = await dispatch(createPinAndImageThunk(data));
        if(newPin) history.push(`/explore/${newPin.id}`);
    };

    useEffect(() => {
        if (textAreaRef.current) {
            textAreaRef.current.style.height = "auto";
            textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
        }
        setTextCount(300 - description.length);
    }, [description]); 
    

    const onDrop = useCallback((acceptedFiles) => {
        acceptedFiles.forEach((file) => {
            setImageFile(file)
            const reader = new FileReader()
            reader.onload = () => {
            // Do whatever you want with the file contents
                const binaryStr = reader.result
                setImageUrl(binaryStr);
            }
            reader.readAsDataURL(file)
        })
        
    }, [setImageFile, setImageUrl]);


    const {getRootProps, getInputProps} = useDropzone({onDrop, maxFiles: 1, accept: {
        'image/*': []
      }})
      
    const clearForm = () => {
        setImageFile();
        setImageUrl("");
        setTitle("");
        setDescription("")
        setTextAreaId("about-pin-input");
        setTextCount(0);
    };

    const butttonDisable = () => {
        return !title.length && !description.length && !imageFile
    };

    return (
        <div className="create-pin-main-container">
            <div className="create-pin-inner-container">
                <div className="create-board-container">
                    <div className="create-board-inner-contaner">
                        <div 
                            className="clear-form-container"
                            onClick={clearForm}
                        >
                            <span className="material-symbols-outlined" id="material-symbols-clear-form">
                                remove_selection
                            </span>
                        </div>
                        <div className="save-to-board-container">
                            <SavePinToBoard />
                        </div>
                    </div>

                </div>
                <div className="create-pin-form-content-container">
                    {
                        imageUrl.length < 1 ? <div className="image-drop-container">
                            <div className="image-drop-inner-conatiner">
                                <div {...getRootProps()} id="image-drop-zone">
                                    <input {...getInputProps()} />
                                    <div className="material-symbols-upload-container">
                                        <span className="material-symbols-outlined" id="material-symbols-upload">
                                            upload
                                        </span>
                                    </div>
                                    <p>Drag and drop or click to upload</p>
                                </div>
                            </div>
                        </div> : 
                        <div className="create-pin-selected-image-container">
                            <div className="create-pin-selected-image-inner-container">
                                <img src={imageUrl} alt="selected-pin" id="selected-pin-create" />                                
                            </div> 
                        </div>
                    }

                    <div className="create-pin-content-container">
                        <div className="create-pin-content-inner-container">
                            <input 
                                type="text" 
                                id="title-input" 
                                placeholder="Add your title"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                            />

                            <div className="create-pin-user-info-container">
                                <div className="create-pin-profile-img">
                                    {sessionUser.profile_url ? 
                                    <img src={sessionUser.profile_url} alt="session user profile" /> : 
                                    sessionUser.first_name[0]}
                                </div>

                                <div className="create-pin-user-follower-container">
                                    <div className="username">{sessionUser.first_name} {sessionUser.last_name}</div>
                                    <div className="follower">{sessionUser.followers.length} {sessionUser.followers.length <= 1 ? "follower" : "followers"}</div>
                                </div>
                            </div>
                            
                            <div className="create-pin-textarea-container">
                                <textarea 
                                ref={textAreaRef}
                                type="text" 
                                id={textAreaId}
                                placeholder="Tell everyone what your Pin is about"
                                spellCheck="true"
                                value={description}
                                maxLength="300"
                                onChange={e => {
                                    setDescription(e.target.value)
                                }}
                                onClick={() => setTextAreaId("about-pin-input-clicked")}
                                onBlur={() => setTextAreaId("about-pin-input")}
                                />
                                <div className="create-pin-emoji-container" >
                                    <div onClick={() => setEmojiOpen(prev => !prev)} style={{cursor:"pointer"}}>
                                        <Emoji unified="1f603" size={22} />
                                    </div>
                                    <div className="emoji-picker-container">
                                        { emojiOpen && <EmojiPicker
                                            onEmojiClick={(emojiData, event) => {
                                                const emoji = String.fromCodePoint(parseInt(emojiData.unified, 16));
                                                setDescription(prev => prev + emoji);
                                            }}
                                            autoFocusSearch={false}
                                            emojiStyle={EmojiStyle.NATIVE}
                                            id="emoji-picker" 
                                        /> }
                                    </div>
                                </div>
                            </div>
                            { textAreaId === "about-pin-input-clicked" && 
                            <p className="about-pin-input-warning">
                            <span className="text-container">
                              People will usually see the first 50 characters when they click on your Pin
                            </span>
                            <span id="about-pin-counter">{textCount}</span>
                            </p>
                            }
                            <div className="create-pin-save-btn">
                                <RedBackgroundBtn text={"Save"} disabled={butttonDisable} onClick={handleSubmit} />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

