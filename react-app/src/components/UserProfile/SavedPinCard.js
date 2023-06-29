import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./userProfile.css";
import EditNonUserPin from "../pins/editPin/editNonUserPin";
import { useModal } from "../../context/Modal";


export default function SavedPinCard({pin}) {

    const [onHoverPinId, setOnHoverPinId] = useState(null);

    const { setModalContent, closeModal } = useModal();

    const handleOpenEditNonUserPinForm = () => {
        setModalContent(<EditNonUserPin
          closeEditNonUserPinForm={closeModal}
          openLocation={"Save Pin Card"}
          pin={pin}  
        />)
    };


    return (
        <div 
            className="saved-pin-single-container"
            onMouseEnter={() => setOnHoverPinId(pin.pin.id)}
            onMouseLeave={() => setOnHoverPinId(null)}
        >
            {onHoverPinId === pin.pin.id && <div  id="saved-pin-add-profile-icon" 
            onClick={handleOpenEditNonUserPinForm}
            >
                    +
            </div>}                                      
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
    )

};