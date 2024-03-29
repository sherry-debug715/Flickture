import { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import RedBackgroundBtn from "../ui/Buttons/RedBackgroundBtn";
import InputField from "../ui/Input/InputField";
import { useModal } from "../../context/Modal";
import ChangePictureModal from "./EditUserProfileChangePictureModal";
import { editUserProfileThunk } from "../../store/user";
import "./userProfile.css";

export default function EditUserProfile () {
    const sessionUser = useSelector(state => state.session.user);
    const [firstName, setFirstName] = useState(sessionUser.first_name);
    const [lastName, setLastName] = useState(sessionUser.last_name);
    const [userName, setUsername] = useState(sessionUser.username);
    const [email, setEmail] = useState(sessionUser.email);
    const [profileUrl, setProfileUrl] = useState(sessionUser.profile_url);
    const [imageFile, setImageFile] = useState(null);
    const { setModalContent, closeModal } = useModal();
    const dispatch = useDispatch();
    const history = useHistory();

    const handleSubmit = async() => {
        const editedUser = {
            first_name: firstName,
            last_name: lastName,
            username: userName,
            email,
            imageFile
        };

        const editResult = await dispatch(editUserProfileThunk(sessionUser.id, editedUser));
        if (editResult) history.push(`/userProfile/${sessionUser.id}`);
    };

    const buttonDisable = () => {
        const formEmpty = !firstName.length && !lastName.length && !userName.length && !email.length;
        const contentNeverChanged = firstName === sessionUser.first_name && lastName === sessionUser.last_name && userName === sessionUser.username && email === sessionUser.email && profileUrl === sessionUser.profile_url;

        return formEmpty || contentNeverChanged;
    };


    const resetForm = () => {
        setFirstName(sessionUser.first_name);
        setLastName(sessionUser.last_name);
        setUsername(sessionUser.username);
        setEmail(sessionUser.email);
        setProfileUrl(sessionUser.profile_url || null)
    };

    const handleOpenChangePictureModal = () => {
        setModalContent(
        <ChangePictureModal 
        closeModal={closeModal} 
        setImageFile={setImageFile} 
        setProfileUrl={setProfileUrl}
        />
        
        )
    };

    return (
        <div className="edit-user-profile-main-container">
            <div className="edit-user-profile-inner-container">
                <div className="edit-user-profile-inner-container2">
                    <div className="edit-user-profile-form-header">
                        <Link to={`/userProfile/${sessionUser.id}`} className="edit-board-form-arrow-back">
                            <span 
                            className="material-symbols-rounded"
                            id="material-symbols-arrow-back"
                            >
                                arrow_back
                            </span>
                        </Link>
                        <div 
                            className="clear-form-container"
                            onClick={resetForm}
                        >
                            <span className="material-symbols-rounded" id="material-symbols-clear-form">
                                restart_alt
                            </span>
                        </div>
                    </div>

                    <div className="edit-profile-form-content-container">
                        <h1 className="edit-profile-form-title">Edit your profile</h1> 
                        <div className="edit-profile-form-content-area">                                  <div className="edit-profile-form-image-container">
                                <div>
                                    <span className="edit-profile-form-image-label">
                                        Photo
                                    </span>
                                    { profileUrl ? <img src={profileUrl} alt="profile" className="edit-profile-form-profile-image" /> : <div className="edit-profile-form-profile-no-image"> {sessionUser.username[0]} </div> }  
                                </div>
                                <button 
                                    className="edit-profile-form-change-btn-container"
                                    onClick={handleOpenChangePictureModal}
                                >
                                    Change
                                </button>           
                            </div>   
                            <div className="edit-profile-form-first-last-name">
                                <InputField 
                                    size={{ m: 2, width: "18ch"}}
                                    setter={setFirstName}
                                    val={firstName}
                                    label={"First Name"}
                                    id={"standard-basic"}
                                    multiline={false}
                                    variant={"standard"}
                                    labelFontSize={"20px"}
                                />
                                <InputField 
                                    size={{ m: 2, width: "18ch"}}
                                    setter={setLastName}
                                    val={lastName}
                                    label={"Last Name"}
                                    id={"standard-basic"}
                                    multiline={false}
                                    variant={"standard"}
                                    labelFontSize={"20px"}
                                />
                            </div>
                            <InputField 
                                size={{ m: 2, width: "40ch"}}
                                setter={setUsername}
                                val={userName}
                                label={"User Name"}
                                id={"standard-basic"}
                                multiline={false}
                                variant={"standard"}
                                labelFontSize={"20px"}
                            />
                            <InputField 
                                size={{ m: 2, width: "40ch"}}
                                setter={setEmail}
                                val={email}
                                label={"Email"}
                                id={"standard-basic"}
                                multiline={false}
                                variant={"standard"}
                                labelFontSize={"20px"}
                            />
                        </div>
                    </div> 
                    <div className="edit-profile-btn-container">
                        <div className="edit-profile-save-btn">
                            <RedBackgroundBtn 
                                text={"Save"}
                                onClick={handleSubmit}
                                disabled={buttonDisable}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );


}