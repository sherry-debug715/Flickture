import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { getUserSavedPinsThunk } from "../../store/pins";
import "./userProfile.css";


export default function SavedPins() {
    const dispatch = useDispatch();

    const savedPinsState = useSelector(state => state.pins.savedPins);

    const sessionUser = useSelector(state => state.session.user);

    const savedPins = Object.values(savedPinsState);

    useEffect(() => {
        dispatch(getUserSavedPinsThunk(sessionUser.id));
    }, [dispatch]);

    for(let pin of savedPins) {
        if(!pin.pin) return null;
    };

    return (
        <div className="saved-pins-container">
            <div className="saved-pins-inner-container">
                <h1 className="saved-pins-inner-container-title">Saved ideas</h1>
                <div className="saved-pins-pincard-main-container">
                    {savedPins.map(pin => (
                    <div key={pin.id} className="saved-pin-single-container">
                        <Link to={`/explore/${pin.pin.id}`}                     
                        >
                            <img src={pin.pin.pin_images[0].image_url} alt="saved" className="saved-pin-img" />
                            <div className="saved-pin-title">{pin.pin.title}</div>
                        </Link>
                        <Link to={`/userProfile/${pin.pin.creator.id}`} className="saved-pin-user-info-container">
                            {pin.pin.creator.profile_url ? <img src={pin.pin.creator.profile_url} alt="creator-profile" className="saved-pin-user-img"/> : <div className="saved-pin-user-img">{pin.pin.creator.username[0]}</div>}
                            <div>{pin.pin.creator.username}</div>
                        </Link>
                    </div>
                    ))}
                </div>
            </div>
        </div>
    );
};  