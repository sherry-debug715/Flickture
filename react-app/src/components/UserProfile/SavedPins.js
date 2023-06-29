import { useEffect} from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { getUserSavedPinsThunk } from "../../store/pins";
import "./userProfile.css";
import SavedPinCard from "./SavedPinCard";

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

    if(!savedPins.length) return (
        <div className="saved-pins-container">
            <div className="saved-pins-inner-container">
                <h1 className="saved-pins-inner-container-title">Saved ideas</h1>
                <div>
                   {"You haven't saved any ideas yet, "}<Link to="/explore" className="saved-idea-empty">let's find some inspiration! </Link>
                </div>
            </div>
        </div>
    )
    return (
        <div className="saved-pins-container">
            <div className="saved-pins-inner-container">
                <h1 className="saved-pins-inner-container-title">Saved ideas</h1>
                <div className="saved-pins-pincard-main-container">
                    {savedPins.map(pin => (
                        <SavedPinCard key={pin.id} pin={pin} />
                    ))}
                </div>
            </div>
        </div>
    );
};  