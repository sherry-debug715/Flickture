import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import CreatedPinCard from "./CreatedPinCard";
import { getUserCreatedPinsThunk } from "../../store/pins";
import "./userProfile.css";

export default function CreatedPins({userId}) {

    const dispatch = useDispatch();

    const createdUserPins = useSelector(state => state.pins.createdPins);

    useEffect(() => {
        dispatch(getUserCreatedPinsThunk(userId));
    }, [dispatch])

    const userPins = Object.values(createdUserPins);

    return (
        <div className="created-pin-card-container-grid">
           
                {userPins.map(pin => (
                    <div className="created-pin-card-inner-container" key={pin.id} >
                        <CreatedPinCard pin={pin} />
                    </div>
                ))}
        </div>
    );
};