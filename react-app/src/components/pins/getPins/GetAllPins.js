import { useEffect, useState, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAllPinsThunk } from "../../../store/pins";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import "../pins.css";

import PinCard from "../PinCard";

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
                        <PinCard pin={pin} />
                    </Link>
                ))}
            </div>
        </div>
    )

};