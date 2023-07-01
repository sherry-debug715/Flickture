import { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import "../pins.css";
import { getOnePinThunk, getUserSavedPinsThunk, savePinThunk, removeSavedPinThunk } from "../../../store/pins";
import GreyBackgroundBtn from "../../ui/Buttons/greyBackgroundBtn";
import PinsOfCategory from "./PinsOFCategory";
import DetailPageAddToBoard from "./DetailPageAddToBoard";
import { followUserThunk } from "../../../store/session";
import { unfollowUserThunk } from "../../../store/session";
import GetComments from "../../Comments/GetComments";



export default function SinglePin() {

    const [showMenu, setShowMenu] = useState(false);

    const [showComments, setShowComments] = useState(false);

    const [addToFav, setAddToFav] = useState(false);

    const {pinId} = useParams();

    const dispatch = useDispatch();

    const history = useHistory();

    const pin = useSelector(state => state.pins.singlePin);

    const sessionUser = useSelector(state => state.session.user);

    const savedPinsState = useSelector(state => state.pins.savedPins);

    const savedPinIds = Object.values(savedPinsState).map(savedPin => savedPin.pin.id);

    const pinSaved = (pinId) => savedPinIds.includes(+pinId);
    
    useEffect(() => {
        if(pinSaved(pinId)) {
            setAddToFav(true);
        } else setAddToFav(false);
    }, [pinId]);
    
    const handleFavorite = async(pinId) => {
        if(addToFav) {
            const unsavePin = await dispatch(removeSavedPinThunk(pinId))
            if(unsavePin.id) setAddToFav(false);
        } else {
            const savedPin = await dispatch(savePinThunk(pinId));
            if(savedPin) setAddToFav(true);
        }
    }

    const handleHeartColorChange = () => {
        let isFav = addToFav;
        return isFav ? "all-pins-material-icons-favorite-added" : "all-pins-material-icons-favorite";
    };
    
    const openMenu = (e) => {
        e.stopPropagation()
        setShowMenu(prev => !prev);
    };

    useEffect(() => {
        if (!showMenu) return;
    
        const closeMenu = () => {
          setShowMenu(false);
        };
    
        document.addEventListener('click', closeMenu);
      
        return () => document.removeEventListener("click", closeMenu);
      }, [showMenu]);


    useEffect(() => {
        dispatch(getOnePinThunk(pinId));
        dispatch(getUserSavedPinsThunk(sessionUser.id));
    },[dispatch, pinId, sessionUser.following]);

    const handleFollow = userId => {
        dispatch(followUserThunk(userId));
    };

    const handleUnfollow = userId => {
        dispatch(unfollowUserThunk(userId));
    }


    if(!pin.pin_images || !pin.followers ) return null;

    const alreadyFollowing = () => pin.followers.findIndex(user => user.id === sessionUser.id) !== -1;

    return (
        <div className="single-pin-main-container">
            <div className="single-pin-upper-container">
                <div className="single-pin-upper-inner-container">

                    <Link className="single-pin-upper-inner-left-container"
                    to="/explore"
                    >
                        <div className="material-symbols-outlined-container">
                            <span 
                            className="material-symbols-outlined"
                            id="material-symbols-outlined"
                            >
                                arrow_back
                            </span>
                        </div>
                    </Link>

                    <div className="single-pin-upper-inner-right-container">

                        <div className="single-pin-upper-left-container">
                            <img 
                            src={pin.pin_images[0].image_url}
                            alt={pin.title}
                            />
                        </div>
                        
                        <div className="single-pin-upper-right-container">
                            <div className="single-pin-upper-right-inner-container-top">
                                <div className="sinlge-pin-title-save-btns-container">
                                    <div className="single-pin-title">{pin.title}
                                    </div>
                                    {sessionUser && <div className="single-pin-save-btn-container">
                                        {pin.user_id !== sessionUser.id && <div
                                            onClick={() => handleFavorite(pin.id)}
                                        >
                                            <i 
                                            className="material-icons"
                                            id={handleHeartColorChange()}
                                            >
                                                favorite
                                            </i>
                                        </div>}
                                        <div  id="getAllPin-add-profile-icon" 
                                        onClick={openMenu}
                                        >
                                            +
                                        </div>
                                        {showMenu && <DetailPageAddToBoard 
                                        setShowMenu={setShowMenu} 
                                        pinId={pinId}                                        
                                        />}
                                    </div>}
                                </div>

                                <div className="user-info-container">
                                    <div className="single-pin-user-info-left-container"
                                    onClick={() => history.push(`/userProfile/${pin.creator.id}`)}
                                    >
                                        <div className="single-pin-user-profile">
                                            {pin.creator.profile_url ? <img src={pin.creator.profile_url} alt="user profile picture" /> : pin.creator.username[0]}
                                        </div>
                                        <div className="single-pin-user-info-container">
                                            <div className="single-pin-user-name">
                                                {pin.creator.username}
                                            </div>
                                            <div className="single-pin-user-followers-container">
                                                {pin.followers.length > 1 ? pin.followers.length + " followers" : pin.followers.length + " follower"} 
                                            </div>
                                        </div>
                                    </div>                                    
                                    <div className="single-pin-user-info-right-container">
                                        
                                        {alreadyFollowing() ? 
                                        <GreyBackgroundBtn 
                                        text={"Unfollow"} 
                                        onClick={() => handleUnfollow(pin.creator.id)}
                                        /> : <button 
                                        className="single-pin-follow-button"
                                        onClick={() => handleFollow(pin.creator.id)}
                                    >
                                        Follow
                                    </button>}
                                        
                                    </div>
                                </div>

                                <div className="single-pin-image-info-container">
                                    <div className="single-pin-image-description">
                                        About: {pin.description}
                                    </div>
                                </div>

                                <div className="comment-container">
                                    <div className="comment-upper-container">
                                        <div>
                                            {pin.pin_comments.length > 1 ? pin.pin_comments.length+" Comments" : pin.pin_comments.length+" Comment"} 
                                        </div>
                                        <div className="single-pin-show-comment-icon">
                                            {showComments? 
                                                <span 
                                                    className="material-symbols-outlined"
                                                    id="material-symbols-expand"
                                                    onClick={() => setShowComments(false)}
                                                >
                                                    expand_more
                                                </span>
                                                :
                                                <span 
                                                    className="material-symbols-outlined"
                                                    id="material-symbols-expand"
                                                    onClick={() => setShowComments(true)}
                                                >
                                                    expand_less
                                                </span> }
                                        </div>
                                    </div>

                                    <div className="comment-bottom-content-container">
                                        {showComments && <GetComments pinId={pinId} />}
                                    </div>
                                </div>
                            </div>
                            <div className="single-pin-upper-right-inner-container-bottom">

                            </div>
                        </div>
                    </div>

                </div>
            </div>
            {
            pin.pin_cateogiries.length > 0 && 
            (
                <>
                    <div className="single-pin-more-like-this">More like this</div>
                    <div className="single-pin-bottom-container">
                        <PinsOfCategory pinId={pinId} pinSaved={pinSaved} />
                    </div>
                </>
            )
            }
        </div>
    )
};

