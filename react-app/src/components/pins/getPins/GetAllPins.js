import { useEffect, useState, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAllPinsThunk, getUserSavedPinsThunk } from "../../../store/pins";
import "../pins.css";

import PinCard from "../PinCard";

export default function GetAllPins({searchContent}) {
    const dispatch = useDispatch();
    const allPins = useSelector(state => state.pins.allPins);
    const savedPinsState = useSelector(state => state.pins.savedPins);
    const sessionUser = useSelector(state => state.session.user);
    const pinArr = Object.values(allPins.pins);
    const totalPage = allPins.totalPages;

    const [page, setPage] = useState(1);
    const [readyToFetch, setReadyToFetch] = useState(false);
    const [hitBottom, setHitBottom] = useState(false);

    const scrollContainerRef = useRef();

    const savedPinIds = Object.values(savedPinsState).map(savedPin => savedPin.pin.id);

    useEffect(() => {
        setPage(1);
      }, [searchContent]);      

    const pinSaved = (pinId) => savedPinIds.includes(pinId);

    const handleScroll = useCallback(() => {
        if (!readyToFetch) return;
    
        const scrollContainer = scrollContainerRef.current;

        const calculatingScroll = scrollContainer.scrollHeight - scrollContainer.scrollTop - scrollContainer.clientHeight;

        if (calculatingScroll > 1) return;  
        if (page === totalPage) {
            setHitBottom(true);
            return;
        } else setPage(prev => prev + 1);
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
        dispatch(getAllPinsThunk(page, searchContent))
        .then(() => setReadyToFetch(true));    
        if(sessionUser) {
            dispatch(getUserSavedPinsThunk(sessionUser.id));
        }
    }, [dispatch, page]);

    return (
        pinArr.length > 0 ? (
            <>
                <div className="all-pins-container" ref={scrollContainerRef}>
                    <div className={pinArr.length <= 16 ? "few-pins-all-pins-image-container" : "all-pins-image-container"}>
                        {pinArr.map(pin => (
                            <PinCard pin={pin} key={pin.id} pinSaved={pinSaved} pinArr={pinArr} />
                        ))}
                    </div>
                </div>
                {hitBottom &&
                <div
                    className="all-pins-end-of-content-message"
                >Looks like you've reached the end, check back soon for updates.</div>}
            </>
        ) : (
            <div
                className="all-pins-no-search-results-message"
            >
                We couldn't find anything matching your search. Try different keywords!
            </div>
        )
    );
};