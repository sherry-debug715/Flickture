import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { userProfileThunk } from "../../store/user";
import { followUserThunk } from "../../store/session";
import "../Follow/Follow.css";

export default function Follower({userId, closeFollowerModal}) {
    const curUser = useSelector(state => state.user);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(userProfileThunk(userId));
    }, [dispatch, userId]);

    const handleFollow = followedUserId => {
        dispatch(followUserThunk(followedUserId))
        .then(() => dispatch(userProfileThunk(userId)))
        .then(() => closeFollowerModal());
    };

    if(!curUser.id) return null;
    if(!curUser.followers.length) closeFollowerModal();

    const followers = curUser.followers;

    const alreadyFollowing = (followerId) => curUser.following.findIndex(follower => follower.id === followerId) !== -1;

    return (
        <div className="followers-modal-container">
            <div className="followers-modal-inner-container">

                <div className="followers-modal-titile-container">
                    <div className="followers-modal-titile-inner-container">
                        <h1>Followers</h1>           
                        <span 
                            className="material-symbols-rounded"
                            id="material-symbols-close"
                            onClick={() => closeFollowerModal()}
                        >
                        close
                        </span>                   
                    </div>
                </div>

                <div className="followers-modal-user-container">
                    {followers.map(user => (
                        <div className="each-user-container"
                        key={user.id}
                        >
                            <div className="each-user-container-left">
                                {user.profile_url ? 
                                <img src={user.profile_url} alt="user"  className="each-user-profile-img"/> : 
                                <div className="each-user-profile-img-none">
                                    {user.username[0]}
                                </div>}
                                <div className="each-user-username">{user.username}</div>
                            </div>

                            <div 
                                className={!alreadyFollowing(user.id) ?"each-user-container-follow-btn" : "each-user-container-follow-btn-disabled"}
                                onClick={() => handleFollow(user.id)}
                            >
                                {alreadyFollowing(user.id) ? "Following" : "Follow"}
                                {console.log(alreadyFollowing(user.id))}
                            </div>

                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};  