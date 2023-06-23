import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUserBoardsThunk } from "../../store/boards";
import BoardCard from "./BoardCard";

export default function UserBoards() {
    const dispatch = useDispatch();
    const userBoards = useSelector(state => state.boards.allBoards);
    const user = useSelector(state => state.session.user);
    const [onHoverBoardId, setOnHoverBoardId] = useState(null);


    const boardsArr = Object.values(userBoards);

    useEffect(() => {
        dispatch(getAllUserBoardsThunk());
    }, [dispatch]);

    const canBeViewed = (board) => {
        if(board.private) {
            if(user.id === board.user_id) {
                return true;
            } else {
                return false;
            };
        } else {
            return true;
        };
    };
    
    return (
        <div className="user-boards-container">
            {boardsArr.map(board => (
                (canBeViewed(board) && <div 
                key={board.id} 
                className="board-card-container"
                onMouseEnter={() => setOnHoverBoardId(board.id)}
                onMouseLeave={() => setOnHoverBoardId(null)}
                >
                    <BoardCard board={board} onHoverBoardId={onHoverBoardId} />
                </div>)
            ))}
        </div>
    )
};