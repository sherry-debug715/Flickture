import { Link } from "react-router-dom";
import { useState } from "react";
import "./pins.css";


export default function PinCard({pin}) {

    const [onHoverPinId, setOnHoverPinId] = useState(null);

    return (
                <div className="each-pin-container"
                    onMouseEnter={() => setOnHoverPinId(pin.id)}
                    onMouseLeave={() => setOnHoverPinId(null)}
                    >
                        {
                           onHoverPinId === pin.id && <div className="all-pins-hover-over-container-top">
                                <div>
                                    <i 
                                    className="material-icons"
                                    id="material-icons-favorite"
                                    >
                                        favorite
                                    </i>
                                </div>
                                <div  id="getAllPin-add-profile-icon" >
                                    +
                                </div>
                            </div>
                        }
                          
                        <img src={pin.pin_images} className="all-pins-image"  />
                            
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
                </div>
            );

};


