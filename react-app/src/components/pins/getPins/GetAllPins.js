import { useEffect, useState, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAllPinsThunk } from "../../../store/pins";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import "../pins.css";

export default function GetAllPins() {
    const dispatch = useDispatch();
    const allPins = useSelector(state => state.pins.allPins);
    const pinArr = Object.values(allPins.pins);
    const totalPage = allPins.totalPages;

    const [page, setPage] = useState(1);
    const [readyToFetch, setReadyToFetch] = useState(false);
    const [onHoverPinId, setOnHoverPinId] = useState(null);

    const scrollContainerRef = useRef();

    const handleScroll = useCallback(() => {
        if (!readyToFetch) return;
    
        const scrollContainer = scrollContainerRef.current;

        const calculatingScroll = scrollContainer.scrollHeight - scrollContainer.scrollTop - scrollContainer.clientHeight;

        if (calculatingScroll > 1 || page === totalPage) return;        
        else setPage(prev => prev + 1);
    }, [readyToFetch, page, totalPage]);

    useEffect(() => {
        const scrollContainer = scrollContainerRef.current;
        if (scrollContainer) {
            scrollContainer.addEventListener('scroll', handleScroll);
        }

        return () => {
            if (scrollContainer) {
                scrollContainer.removeEventListener('scroll', handleScroll);
            }
        };
    }, [handleScroll]);

    
    useEffect(() => {
        setReadyToFetch(false);
        dispatch(getAllPinsThunk(page))
        .then(() => setReadyToFetch(true));    
    }, [dispatch, page]);



    return (
        <div className="all-pins-container" ref={scrollContainerRef}>
            <div className="all-pins-image-container"  >
                {pinArr.map(pin => (
                    <Link key={pin.id} to={`/pins/${pin.id}`}  >
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
                    </Link>
                ))}
            </div>
        </div>
    )

};