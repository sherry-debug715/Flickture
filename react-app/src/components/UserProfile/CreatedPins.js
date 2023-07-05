import { useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import CreatedPinCard from "./CreatedPinCard";
import "./userProfile.css";

export default function CreatedPins() {

    const sessionUser = useSelector(state => state.session.user);

    const userPins = sessionUser.pins;

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