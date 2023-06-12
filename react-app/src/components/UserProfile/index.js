import { useSelector } from "react-redux";

export default function UserProfile() {
    const sessionUser = useSelector(state => state.session.user);

    return (
        <div className="userProfile-container">
            <div className="userProfile-inner-container">
                <div className="user-info">
                    <div className="user-profile-img">
                        {
                        sessionUser.profile_url ? <img src={sessionUser.profile_url} className='profile-image' alt="profile" /> : <div className='profile-image'>{sessionUser.first_name[0]}</div>
                        }
                    </div>

                    <div className="user-profile-username">
                        {sessionUser.username}
                    </div>
                    <div className="user-profile-email">
                        {sessionUser.email}
                    </div>
                    <div className="user-profile-follow">
                        <div>
                            {sessionUser.followers.length < 1 ? <div>{sessionUser.followers.length} follower</div> : <div>{sessionUser.followers.length} followers</div>}
                        </div>
                        <div>
                            {sessionUser.following.length < 1 ? <div>{sessionUser.following.length} following</div> : <div>{sessionUser.following.length} followings</div>}
                        </div>
                    </div>
                </div>

                <div className="userProfile-board-container">

                </div>

                <div className="userProfile-unorganized-pins-container">

                </div>

            </div>
        </div>
    )
};