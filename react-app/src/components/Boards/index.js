import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, Link } from "react-router-dom";
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
            <div className="board-pins-back-arrow-container">
                <div className="material-symbols-outlined-container">
                    <Link 
                        to={`/userProfile/${userBoards.user_id}`} 
                    >
                            <span 
                            className="material-symbols-outlined"
                            id="material-symbols-outlined"
                            >
                                arrow_back
                            </span>
                    </Link>
                </div>
            </div>
            {!boardPins.length ? (
                <div className="saved-pins-inner-container">
                <h1 className="saved-pins-inner-container-title">Board Detail</h1>
                <div>
                   {"You haven't saved any ideas yet, "}<Link to="/explore" className="saved-idea-empty">let's find some inspiration! </Link>
                </div>
            </div>
            ) : 
            <div className="board-pins-inner-container">
                {boardPins.map(pin => (
                    <div key={pin.pin_id} className="board-pins-pin-card-container" >
                        <BoardPinCard pin={pin} boardId={boardId} />
                    </div>
                ))}
            </div>
            }
        </div>
    )
};