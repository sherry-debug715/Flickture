import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import "../pins.css";
import { getAllPinsThunk } from "../../../store/pins";


export default function SinglePin() {
    const {pinId} = useParams();
    const dispatch = useDispatch();

    const pin = useSelector(state => state.pins.allPins)[pinId]

    // useEffect(() => {
    //     dispatch()
    // },[dispatch])
    console.log("pin", pin)
    return (
        <h1>Single</h1>
    )
};

