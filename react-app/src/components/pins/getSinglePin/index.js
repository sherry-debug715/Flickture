import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import "../pins.css";
import { getOnePinThunk } from "../../../store/pins";
import GreyBackgroundBtn from "../../ui/Buttons/greyBackgroundBtn";
import PinsOfCategory from "./PinsOFCategory";
import DetailPageAddToBoard from "./DetailPageAddToBoard";


export default function SinglePin() {

    const [showMenu, setShowMenu] = useState(false);

    const {pinId} = useParams();

    const dispatch = useDispatch();

    const pin = useSelector(state => state.pins.singlePin);

    const sessionUser = useSelector(state => state.session.user);

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
    },[dispatch, pinId])

    if(!pin.pin_images || !pin.followers ) return null;

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
                            <div className="single-pin-upper-right-inner-container">
                                <div className="sinlge-pin-title-save-btns-container">
                                    <div className="single-pin-title">{pin.title}
                                    </div>
                                    {sessionUser && <div    className="single-pin-save-btn-container">
                                        <div>
                                            <i 
                                            className="material-icons"
                                            id="material-icons-favorite"
                                            >
                                                favorite
                                            </i>
                                        </div>
                                        <div  id="getAllPin-add-profile-icon" 
                                        onClick={() => setShowMenu(true)}
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
                                    <div className="single-pin-user-info-left-container">
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
                                        <GreyBackgroundBtn text={"Follow"} />
                                    </div>
                                </div>

                                <div className="single-pin-image-info-container">
                                    <div className="single-pin-image-description">
                                        {pin.description}
                                    </div>
                                </div>

                                <div className="comment-container">
                                    <div className="comment-upper-container">
                                        {pin.pin_comments.length > 1 ? pin.pin_comments.length+" Comments" : pin.pin_comments.length+" Comment"} 
                                    </div>

                                </div>
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
                        <PinsOfCategory pinId={pinId} />
                    </div>
                </>
            )
            }
        </div>
    )
};

