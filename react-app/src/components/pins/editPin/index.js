import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOnePinThunk } from "../../../store/pins";
import RedBackgroundBtn from "../../ui/Buttons/RedBackgroundBtn";
import SavePinToBoard from "../../SavePinToBoard";
import { editPinThunk } from "../../../store/pins";
import { getBoardDetailThunk } from "../../../store/boards";
import GreyBackgroundBtn from "../../ui/Buttons/greyBackgroundBtn";
import DeletePinForm from "../deletePin";
import { useModal } from "../../../context/Modal";
import "../pins.css";

import EmojiPicker, {
    EmojiStyle,
    Emoji,
  } from "emoji-picker-react";

export default function EditPinForm({pinId, closeEditFormModal, boardId, setCheckChangedBoardId, openLocation}) {
    const dispatch = useDispatch();
    const [imageUrl, setImageUrl] = useState("")
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [selectedBoardId, setSelectedBoardId] = useState(null);
    const [textAreaId, setTextAreaId] = useState("about-pin-input");
    const [boardPinBelongsTo, setBoardPinBelongsTo] = useState([]);
    const [textCount, setTextCount] = useState(0);
    const textAreaRef = useRef(null);
    const [emojiOpen, setEmojiOpen] = useState(false);
    const sessionUser = useSelector(state => state.session.user);
    const [reset, setReset] = useState(false);
    const { setModalContent, closeModal } = useModal();


    const openEmoji = (e) => {
        e.stopPropagation();
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

    const handleOpenDeletePinForm = () => {
        setModalContent(<DeletePinForm pinId={pinId} closeDeletePinModal={closeModal} boardId={boardId} />)
    };


    useEffect(() => {
        dispatch(getOnePinThunk(pinId))
        .then(data => {
            setImageUrl(data.pin_images[0].image_url)
            setTitle(data.title)
            setDescription(data.description)
            setBoardPinBelongsTo(data.pin_in_profiles)
        });
    },[dispatch, reset]);

    useEffect(() => {
        if (textAreaRef.current) {
            textAreaRef.current.style.height = "auto";
            textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
        }
        setTextCount(300 - description.length);
    }, [description]); 


    const handleSubmit = async() => {
        const editedPin = {
            title,
            description,
            selectedBoardId,
            boardId: +boardId
        };

        const returnedData = await dispatch(editPinThunk(pinId, editedPin));
        if(returnedData) {
            if(openLocation === "EditBoardForm") {
                setCheckChangedBoardId(selectedBoardId)
            }
            if(openLocation !== "Created pin card") {
                dispatch(getBoardDetailThunk(boardId))
                .then(() => localStorage.removeItem("newBoardName"))
            }
            closeEditFormModal()
        };

    };

    const butttonDisable = () => {
        return !title.length && !description.length
    };

    return (
        <div className="edit-pin-main-container">
            <div className="edit-pin-inner-container">
                <div className="create-board-container">
                    <div className="create-board-inner-contaner">
                        <div 
                            className="edit-pin-clear-form-container"
                            onClick={() => setReset(prev => !prev)}
                        >
                            <span className="material-symbols-rounded" id="material-symbols-clear-form">
                            restart_alt
                            </span>
                        </div>
                        <div className="save-to-board-container">
                            <SavePinToBoard 
                            setSelectedBoardId={setSelectedBoardId} boardPinBelongsTo={boardPinBelongsTo} 
                            openLocation={"Edit pin modal"}   
                            currentPinId={pinId}  
                            boardId={boardId}                       
                            />
                        </div>
                    </div>
                </div>

                <div className="create-pin-form-content-container">
                                            
                    <div className="create-pin-selected-image-container">
                        <div className="create-pin-selected-image-inner-container">
                            <img src={imageUrl} alt="selected-pin" id="selected-pin-create" />                                
                        </div> 
                    </div>
                    

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
                                <div className="edit-pin-emoji-container" >
                                    <div onClick={openEmoji} style={{cursor:"pointer"}}>
                                        <Emoji unified="1f603" size={22} />
                                    </div>
                                    <div className="edit-pin-emoji-picker-container">
                                        { emojiOpen && <EmojiPicker
                                            onEmojiClick={(emojiData) => {
                                                const emoji = String.fromCodePoint(parseInt(emojiData.unified, 16));
                                                setDescription(prev => prev + emoji);
                                            }}
                                            autoFocusSearch={false}
                                            emojiStyle={EmojiStyle.NATIVE}
                                            id="edit-pin-emoji-picker" 
                                            height="400px"
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
                                <RedBackgroundBtn 
                                text={"Save"} 
                                disabled={butttonDisable} 
                                onClick={handleSubmit}
                                />
                            </div>
                            <div className="delete-pin-btn">
                                <GreyBackgroundBtn 
                                text={"Delete"} 
                                onClick={handleOpenDeletePinForm}
                                />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};