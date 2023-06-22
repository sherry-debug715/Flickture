import { useState } from "react";
import { Link } from "react-router-dom";
import EditPinForm from "../pins/editPin";
import { useModal } from "../../context/Modal";
import "./boards.css";

export default function BoardPinCard({pin, boardId}) {

    const [onHoverPinId, setOnHoverPinId] = useState(null);

    const { setModalContent, closeModal } = useModal();

    const handleOpenEditPinForm = (pinId) => {
        setModalContent(<EditPinForm pinId={pinId} closeModal={closeModal} boardId={boardId} />)
    };

    return (
        <div className="board-pin-card-container"
            onMouseEnter={() => setOnHoverPinId(pin.pin_id)}
            onMouseLeave={() => setOnHoverPinId(null)}
        >
            <Link to={`/explore/${pin.pin_id}`} className="board-pin-card-image-link">
                <div className="board-pin-card-image-container">
                    <img src={pin.image_url} alt="pin-card" />
                    <div>{pin.title}</div>
                </div>
            </Link>

            <Link to={`/userProfile/${pin.user_id}`}>
                <div className="board-pin-card-content-container">
                    <div className="board-pin-card-user-profile">
                        {
                        pin.profile_url ? 
                        <img src={pin.profile_url} /> : 
                        <div className="board-pin-username">{pin.username[0]}</div>
                        }
                        <div className="board-pin-card-username">
                            {pin.username}
                        </div>
                    </div>
                </div>
            </Link>
            {
            onHoverPinId === pin.pin_id && 
            <div 
                className="board-pin-hover-over-container"
                onClick={() => handleOpenEditPinForm(pin.pin_id)}
            >
                <span 
                    className="material-symbols-outlined"
                    id="material-symbols-edit"
                >
                    edit
                </span>
            </div>
            }
        </div>
    )
};