import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { getUserSavedPinsThunk } from "../../store/pins";


export default function SavedPins() {
    const dispatch = useDispatch();

    const savedPinsState = useSelector(state => state.pins.allPins.pins);

    const sessionUser = useSelector(state => state.session.user);

    const savedPins = Object.values(savedPinsState);

    useEffect(() => {
        dispatch(getUserSavedPinsThunk(sessionUser.id));
    }, [dispatch]);


    return (
        <div className="saved-pins-container">
            <div className="saved-pins-inner-container">
                <h1>Saved ideas</h1>
                <div>{savedPins.map(pin => (
                    <Link to={`/explore/${pin.pin.id}`} className="saved-pin-single-container" 
                    key={pin.id}
                    >
                        <img src={pin.pin.pin_images[0].image_url} alt="saved" className="saved-pin-img" />
                        <div className="saved-pin-title">{pin.pin.title}</div>
                        <Link to={`/userProfile/${pin.pin.creator.id}`} className="saved-pin-user-info-container">
                           {pin.pin.creator.profile_url ? <img src={pin.pin.creator.profile_url} alt="creator-profile" className="saved-pin-user-img"/> : <div className="saved-pin-user-img">{pin.pin.creator.username[0]}</div>}
                           <div>{pin.pin.creator.username}</div>
                        </Link>
                    </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};  