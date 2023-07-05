import { useState } from "react";
import { useSelector } from "react-redux";
import {Link} from "react-router-dom";
import { useModal } from "../../context/Modal";
import EditPinForm from "../pins/editPin";

import "./userProfile.css";


export default function CreatedPinCard({pin, userId}) {

    const { setModalContent, closeModal } = useModal();

    const [onHoverPinId, setOnHoverPinId] = useState(null);

    const sessionUserId = useSelector(state => state.session.user.id);

    const handleOpenEditPinForm = pinId => {
        setModalContent(
            <EditPinForm 
                pinId={pinId}
                closeEditFormModal={closeModal}   
                openLocation={"Created pin card"}             
            />
        );
    };
    

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
            {sessionUserId === +userId && onHoverPinId === pin.id && (
                <div 
                    className="created-pin-card-edit-icon"
                    onClick={() => handleOpenEditPinForm(pin.id)}
                >
                    <span 
                        className="material-symbols-outlined"
                        id="material-symbols-edit"
                    >
                        edit
                    </span>
                </div>
            )}        
        </div>
    );
};