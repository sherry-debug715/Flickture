import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { userProfileThunk } from "../../store/user";
import { unfollowUserThunk, followUserThunk } from "../../store/session";
import "./Follow.css";

export default function Following({userId, closeFollowingModal}) {
    const curUser = useSelector(state => state.user);

    const sessionUser = useSelector(state => state.session.user);
    console.log("sessionUser", sessionUser)
    const dispatch = useDispatch();

    const sessionUserFollowing = (userId) => {
        const sessionUserFollow = sessionUser.following;
        return sessionUserFollow.findIndex(user => user.id === userId) !== -1
    };

    useEffect(() => {
        dispatch(userProfileThunk(userId));
    }, [dispatch, userId]);

    const handleUnfollow = unfollowedUserId => {
        dispatch(unfollowUserThunk(unfollowedUserId))
        .then(() => {
            dispatch(userProfileThunk(userId));
        });
    };

    const handleFollow = followedId => {
        dispatch(followUserThunk(followedId))
        .then(() => {
            dispatch(userProfileThunk(userId));
        });
    };
    
    if(!curUser.id) return null;
    if(!curUser.following.length) closeFollowingModal();        

    const following = curUser.following;

    return (
        <div className="following-modal-container">
            <div className="following-modal-inner-container">
                <div className="following-modal-titile-container">
                    <div className="following-modal-titile-inner-container">
                        <h1>Following</h1>           
                        <span 
                            className="material-symbols-rounded"
                            id="material-symbols-close"
                            onClick={() => closeFollowingModal()}
                        >
                        close
                        </span>                   
                    </div>
                </div>

                <div className="following-modal-user-container">
                    {following.map(user => (
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

                            {userId === sessionUser.id ? <div 
                                className="each-user-container-unfollow-btn"
                                onClick={() => handleUnfollow(user.id)}
                            >
                                Unfollow
                            </div> : user.id !== sessionUser.id && <div 
                                className={!sessionUserFollowing(user.id) ?"each-user-container-follow-btn" : "each-user-container-follow-btn-disabled"}
                                onClick={() => handleFollow(user.id)}
                            >
                                {sessionUserFollowing(user.id) ? "Following" : "Follow"}
                            </div>}

                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};