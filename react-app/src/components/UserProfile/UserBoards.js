import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUserBoardsThunk } from "../../store/boards";
import BoardCard from "./BoardCard";

export default function UserBoards({userId}) {
    const dispatch = useDispatch();
    const userBoards = useSelector(state => state.boards.allBoards);
    const sessionUser = useSelector(state => state.session.user);
    const [onHoverBoardId, setOnHoverBoardId] = useState(null);


    const boardsArr = Object.values(userBoards);


    useEffect(() => {
        if(sessionUser) {
            dispatch(getAllUserBoardsThunk(userId));
        }
    }, [dispatch, userId]);

    const canBeViewed = (board) => {
        if(board.private && board.name !== "All Pins") {
            if(sessionUser.id === board.user_id) {
                return true;
            } else {
                return false;
            };
        } else {
            return true;
        };
    };
    
    return (
        <div className={boardsArr.length > 3 ?"user-boards-container-grid" : "user-boards-container-flex"}>
            {boardsArr.map(board => (
                (canBeViewed(board) && <div 
                key={board.id} 
                className="board-card-container"
                onMouseEnter={() => setOnHoverBoardId(board.id)}
                onMouseLeave={() => setOnHoverBoardId(null)}
                >
                    <BoardCard 
                        board={board} 
                        onHoverBoardId={onHoverBoardId} 
                        sessionUser={sessionUser}
                        userId={+userId}
                        numOfBoards={boardsArr.length}
                    />
                </div>)
            ))}
        </div>
    )
};