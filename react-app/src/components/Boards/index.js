import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { getBoardDetailThunk } from "../../store/boards";
import BoardPinCard from "./BoardPinCard";
import "./boards.css";

export default function BoardPins() {
    const userBoards = useSelector(state => state.boards.singleBoard);

    const dispatch = useDispatch();

    const {boardId} = useParams();

    useEffect(() => {
        dispatch(getBoardDetailThunk(boardId));
    }, [dispatch]);

    if(!userBoards.pins) return null;

    const boardPins = userBoards.pins;

    return (
        <div className="board-pins-container">
            <div className="board-pins-inner-container">
                {boardPins.map(pin => (
                    <div key={pin.pin_id} className="board-pins-pin-card-container" >
                        <BoardPinCard pin={pin} />
                    </div>
                ))}
            </div>
        </div>
    )
};