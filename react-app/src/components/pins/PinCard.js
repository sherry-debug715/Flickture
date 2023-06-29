import { useState } from "react";
import { useDispatch } from "react-redux";
import { savePinThunk } from "../../store/pins";
import { Link } from "react-router-dom";
import "./pins.css";


export default function PinCard({pin, pinSaved}) {

    const [onHoverPinId, setOnHoverPinId] = useState(null);

    const [addToFav, setAddToFav] = useState(false);

    const dispatch = useDispatch();


    const handleSaveToFavorate = async(pinId) => {
        const savedPin = await dispatch(savePinThunk(pinId));

        if(savedPin) setAddToFav(true);
    };

    return (
                <div className="each-pin-container"
                    onMouseEnter={() => setOnHoverPinId(pin.id)}
                    onMouseLeave={() => setOnHoverPinId(null)}
                    >
                        
                        <div className="all-pins-hover-over-container-top">
                            <div onClick={() => handleSaveToFavorate(pin.id)}>
                                <i 
                                className="material-icons"
                                id={addToFav || pinSaved(pin.id) ?"all-pins-material-icons-favorite-added" :"all-pins-material-icons-favorite"}
                                >
                                    favorite
                                </i>
                            </div>
                        </div>
                        
                        <Link to={`/explore/${pin.id}`}  > 
                            <img src={pin.pin_images} className="all-pins-image" alt={pin.title}   />                            
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


