import { useSelector } from "react-redux";
import UserBoards from "./UserBoards";
import CreateBoard from "../Boards/createBoard";
import { useModal } from "../../context/Modal";
import "./userProfile.css";
import { useState } from "react";

export default function UserProfile() {
    const sessionUser = useSelector(state => state.session.user);

    const [showPage, setShowPage] = useState("Saved")

    const { setModalContent, closeModal } = useModal();

    const handleOpenCreateBoardForm = () => {
        setModalContent(<CreateBoard 
        closeCreateBoardModal={closeModal}
        openLocation={"User Profile"}
        />)
    };

    return (
        <div className="userProfile-container">
            <div className="userProfile-inner-container">
                <div className="userProfile-user-info">
                    <div className="user-profile-img">
                        {
                        sessionUser.profile_url ? <img src={sessionUser.profile_url} className='user-profile-img-image' alt="profile" /> : <div className='profile-image'>{sessionUser.first_name[0]}</div>
                        }
                    </div>

                    <div className="user-profile-username">
                        {sessionUser.username}
                    </div>
                    <div className="user-profile-email">
                        {sessionUser.email}
                    </div>
                    <div className="user-profile-follow">
                        <div className="user-profile-follow-inner">
                            {sessionUser.followers.length < 1 ? <div>{sessionUser.followers.length} follower</div> : <div>{sessionUser.followers.length} followers</div>}
                        </div>
                        {" · "}
                        <div className="user-profile-following-inner">
                            {sessionUser.following.length < 1 ? <div>{sessionUser.following.length} following</div> : <div>{sessionUser.following.length} followings</div>}
                        </div>
                    </div>
                </div>

                <div className="userProfile-page-select-container">
                    <div 
                        onClick={() => setShowPage("Created")} 
                        className={showPage === "Created" ? "user-profile-selected" : ""}
                    >Created</div>
                    <div 
                        onClick={() => setShowPage("Saved")}
                        className={showPage === "Saved" ? "user-profile-selected" : ""}
                    >Saved</div>
                </div>

                <div className="userProfile-create-board-icon-container">
                    <div 
                        className="userProfile-create-board-icon"
                        onClick={handleOpenCreateBoardForm}
                    >+</div>
                </div>

                {showPage === "Saved" && <div className="userProfile-board-container">
                    <UserBoards />
                </div>}

            </div>
        </div>
    )
};