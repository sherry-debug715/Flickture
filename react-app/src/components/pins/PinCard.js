import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { savePinThunk, removeSavedPinThunk, getUserSavedPinsThunk } from "../../store/pins";
import { Link } from "react-router-dom";
import "./pins.css";


export default function PinCard({pin, pinSaved, onClick, pinArr}) {

    const [onHoverPinId, setOnHoverPinId] = useState(null);

    const [addToFav, setAddToFav] = useState(false);

    const dispatch = useDispatch();

    const sessionUser = useSelector(state => state.session.user);

    useEffect(() => {
        if(pinSaved(pin.id)) setAddToFav(true);
        else setAddToFav(false);
    }, [pin.id]);


    const handleFavorite = async(pinId) => {
        if(addToFav) {
            const unsavePin = await dispatch(removeSavedPinThunk(pinId))
            if(unsavePin.id) {
                dispatch(getUserSavedPinsThunk(sessionUser.id));
                setAddToFav(false)
            };
        } else {
            const savedPin = await dispatch(savePinThunk(pinId));
            if(savedPin) setAddToFav(true);
        }
    } 

    const handleHeartColorChange = () => {
        if(addToFav || pinSaved(pin.id)) return "all-pins-material-icons-favorite-added";
        if(!addToFav) return "all-pins-material-icons-favorite"
    };

    return (
                <div className={pinArr && pinArr.length > 16 ? "each-pin-container" : "fewer-pins-each-pin-container"}
                    onMouseEnter={() => setOnHoverPinId(pin.id)}
                    onMouseLeave={() => setOnHoverPinId(null)}
                    onClick={onClick}
                    >
                        
                        <div className="all-pins-hover-over-container-top">
                            {sessionUser && pin.user_id !== sessionUser.id && <div onClick={() => handleFavorite(pin.id)}>
                                <i 
                                className="material-icons"
                                id={handleHeartColorChange()}
                                >
                                    favorite
                                </i>
                            </div>}
                        </div>
                        
                        <Link to={`/explore/${pin.id}`}  > 
                            <img src={pin.pin_images} className={pinArr && pinArr.length > 16 ? "all-pins-image" : "fewer-pins-image"} alt={pin.title}   />                            
                            {
                                onHoverPinId === pin.id &&                             
                                <div className="all-pins-hover-over-container-bottom">

                                    <div className="image-hover-over-left-section">
                                        <div id="image-hover-over-font">by {pin.creator.username}</div>
                                    </div>

                                    <div className="image-hover-over-right-section">
                                        <div><span   className="material-symbols-outlined"
                                        id="material-symbols-comment"
                                        >
                                            comment
                                        </span></div>
                                        <div id="image-hover-over-font">{pin.pin_comments.length}</div>
                                    </div>
                                </div>
                                
                            }
                        </Link>
                          
                </div>
            );

};


