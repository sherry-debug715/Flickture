import { useState } from "react";
import {Link} from "react-router-dom";
import { useModal } from "../../context/Modal";

import "./userProfile.css";


export default function CreatedPinCard({pin}) {

    const { setModalContent, closeModal } = useModal();

    const [onHoverPind, setOnHoverPinId] = useState(null);
    

    return (
        <div 
            className="created-pin-card-inner-container"
            onMouseEnter={() => setOnHoverPinId(pin.id)}
            onMouseLeave={() => setOnHoverPinId(null)}
        >
            <Link to={`/explore/${pin.id}`} >
                <img 
                    src={pin.image_url} alt="preview" 
                    className="created-pin-img"
                />
            </Link>
            <div className="created-pin-title">{pin.title}</div>           
        </div>
    );
};