import { useEffect, useState, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAllPinsThunk, getUserSavedPinsThunk } from "../../../store/pins";
import "../pins.css";

import PinCard from "../PinCard";

export default function GetAllPins() {
    const dispatch = useDispatch();
    const allPins = useSelector(state => state.pins.allPins);
    const savedPinsState = useSelector(state => state.pins.savedPins);
    const sessionUser = useSelector(state => state.session.user);
    const pinArr = Object.values(allPins.pins);
    const totalPage = allPins.totalPages;

    const [page, setPage] = useState(1);
    const [readyToFetch, setReadyToFetch] = useState(false);

    const scrollContainerRef = useRef();

    const savedPinIds = Object.values(savedPinsState).map(savedPin => savedPin.pin.id);
    

    const pinSaved = (pinId) => savedPinIds.includes(pinId);

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
        if(sessionUser) {
            dispatch(getUserSavedPinsThunk(sessionUser.id));
        }
    }, [dispatch, page]);



    return (
        <div className="all-pins-container" ref={scrollContainerRef}>
            <div className="all-pins-image-container"  >
                {pinArr.map(pin => (
                    <PinCard pin={pin} key={pin.id} pinSaved={pinSaved} />            
                ))}
            </div>
        </div>
    );

};