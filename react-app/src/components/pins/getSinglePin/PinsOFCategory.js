import { useEffect, useState, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getPinsOfCategory } from "../../../store/pins";
import { Link } from "react-router-dom";
import "../pins.css";

import PinCard from "../PinCard";

export default function PinsOfCategory({pinId}) {
    const dispatch = useDispatch();
    const pinsOfCategory = useSelector(state => state.pins.pinsOfCategory);
    const pinArr = Object.values(pinsOfCategory.pins);
    const totalPage = pinsOfCategory.totalPages;

    const [page, setPage] = useState(1);
    const [readyToFetch, setReadyToFetch] = useState(false);

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
        dispatch(getPinsOfCategory(pinId, page))
        .then(() => setReadyToFetch(true));    
    }, [dispatch, page, pinId]);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth" 
        });
    };

    return (
        <div className="all-pins-container" ref={scrollContainerRef}>
            <div className="all-pins-image-container"  >
                {pinArr.map(pin => (
                    <Link key={pin.id} to={`/explore/${pin.id}`} onClick={scrollToTop} >
                        <PinCard pin={pin} />
                    </Link>
                ))}
            </div>
        </div>
    );
};