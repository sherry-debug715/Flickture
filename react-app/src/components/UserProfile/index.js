import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, Link } from "react-router-dom";
import UserBoards from "./UserBoards";
import CreateBoard from "../Boards/createBoard";
import { useModal } from "../../context/Modal";
import "./userProfile.css";
import { useState } from "react";
import { userProfileThunk } from "../../store/user";
import { followUserThunk } from "../../store/session";
import { unfollowUserThunk } from "../../store/session";
import GreyBackgroundBtn from "../ui/Buttons/greyBackgroundBtn";
import Following from "../Follow/Following";
import Follower from "../Follower/Follower";
import SavedPins from "./SavedPins";
import CreatedPins from "./CreatedPins";

export default function UserProfile() {
    const sessionUser = useSelector(state => state.session.user);

    const curUser = useSelector(state => state.user);

    const { userId } = useParams();

    const dispatch = useDispatch();

    const [showPage, setShowPage] = useState("Saved")

    const { setModalContent, closeModal } = useModal();

    useEffect(() => {
        dispatch(userProfileThunk(userId));
    }, [dispatch, userId])

    const handleOpenCreateBoardForm = () => {
        setModalContent(<CreateBoard 
        closeCreateBoardModal={closeModal}
        openLocation={"User Profile"}
        />)
    };

    const handleOpenFollowingModal = () => {
        if(curUser.following.length) {
            setModalContent(<Following
                closeFollowingModal={closeModal}
                userId={curUser.id}
            />
            )
        };
    };

    const handleOpenFollowersModal = () => {
        if(curUser.followers.length) {
            setModalContent(<Follower
                closeFollowerModal={closeModal}
                userId={userId}
            />    
            );
        };
    };

    const handleFollow = (curuserId, user) => {
        dispatch(followUserThunk(curuserId, user))
        .then(() =>  dispatch(userProfileThunk(userId)))
    };

    const handleUnfollow = (curuserId, user) => {
        dispatch(unfollowUserThunk(curuserId, user))
        .then(() =>  dispatch(userProfileThunk(userId)))
    };

    if(!curUser.id) return null;

    const alreadyFollowing = () => curUser.followers.findIndex(user => user.id === sessionUser.id) !== -1;

    return (
        <div className="userProfile-container">
            <div className="userProfile-inner-container">
                <div className="userProfile-user-info">
                    <div className="user-profile-img">
                        {
                        curUser.profile_url ? <img src={curUser.profile_url} className='user-profile-img-image' alt="profile" /> : <div className='profile-image'>{curUser.first_name[0]}</div>
                        }
                    </div>
                    <Link className="user-profile-edit-btn" to="/users/userProfile/edit">edit</Link>

                    <div className="user-profile-username">
                        {curUser.username}
                    </div>
                    <div className="user-profile-email">
                        {curUser.email}
                    </div>
                    <div className="user-profile-follow">
                        <div 
                            className={curUser.followers.length > 0 ? "user-profile-follow-inner" : "user-profile-follow-inner-disabled"}
                            onClick={handleOpenFollowersModal}
                        >
                            {curUser.followers.length < 1 ? <div>{curUser.followers.length} follower</div> : <div>{curUser.followers.length} followers</div>}
                        </div>
                        {" · "}
                        <div 
                            className={curUser.following.length > 0 ?"user-profile-following-inner" : "user-profile-following-inner-disable"}
                            onClick={handleOpenFollowingModal}
                        >
                            {curUser.following.length < 1 ? <div>{curUser.following.length} following</div> : <div>{curUser.following.length} followings</div>}
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
                    {sessionUser && curUser.id === sessionUser.id && showPage === "Saved" && <div 
                        className="userProfile-create-board-icon"
                        onClick={handleOpenCreateBoardForm}
                    >+</div>}
                </div>

                { sessionUser && curUser.id !== sessionUser.id && 
                    <div className="userProfile-follow-container">
                        {
                        alreadyFollowing() ? <GreyBackgroundBtn 
                            text={"Unfollow"} 
                            onClick={() => handleUnfollow(curUser.id, curUser)}
                            /> : <button 
                            className="single-pin-follow-button"
                            onClick={() => handleFollow(curUser.id, curUser)}
                            >
                            Follow
                        </button>
                        }
                    </div>
                }

                {showPage === "Saved" && <div className="userProfile-board-container">
                    <UserBoards userId={userId} />
                </div>}

                {showPage === "Created" && <CreatedPins userId={userId} />}

                <hr />
                {sessionUser && sessionUser.id === +userId && <SavedPins />}

            </div>
        </div>
    )
};