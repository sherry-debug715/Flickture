import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAllUserBoardsThunk } from "../../../store/boards";
import { getOnePinThunk } from "../../../store/pins";
import { useModal } from "../../../context/Modal";
import CreateBoard from "../../Boards/createBoard";
import "../pins.css";

export default function DetailPageAddToBoard({setShowMenu, pinId}) {

    const dispatch = useDispatch();

    const { setModalContent, closeModal } = useModal();

    const [newBoardId, setNewBoardId] = useState(null);

    const userBoards = useSelector(state => state.boards.allBoards);

    const sessionUserId = useSelector(state => state.session.user.id)

    const userBoardsArr = Object.values(userBoards);

    useEffect(() => {
        dispatch(getAllUserBoardsThunk(sessionUserId));
    },[dispatch]);

    const handleOpenCreateBoardForm = () => {
        setModalContent(
        <CreateBoard 
        closeCreateBoardModal={closeModal}
        setNewBoardId={setNewBoardId}
        openLocation={"Single pin page"}
        setShowMenu={setShowMenu}
        />)
    };

    const organizedUserBoards = [];
    userBoardsArr.forEach(board => {
    const eachBoard = {};
    eachBoard.id = board.id;
    eachBoard.name = board.name;
    if(board.pins.length) {
        let firstPin = board.pins[0];
        eachBoard.imageUrl = firstPin.pin_images[0].image_url;
        const pinIdOfBoard = board.pins.map(pin => pin.id);
        eachBoard.pins = pinIdOfBoard;
    } else {
        eachBoard.imageUrl = null;
        eachBoard.pins = [];
    };
    eachBoard.private = board.private;
    organizedUserBoards.push(eachBoard);
    });

    console.log("organizedUserBoards", organizedUserBoards)
    const handleSave = (board) => {
        fetch(`/api/boards/add_pin_to_board/${pinId}/${board.id}`, {
            method: "POST"
        })
        .then(() => setShowMenu(false));        
    };

    const pinInBoard = pinArr => {
        return pinArr.includes(+pinId)
    };


    return (
            <div className="detail-page-add-to-board-dropdown-container">
                <div>All boards</div>
                <div className="create-board-dropdown-inner-container">
                    {organizedUserBoards.map(board => (
                        <div    
                            className="create-board-each-board-container"   
                            key={board.id}                      
                        >
                            <div className="create-board-each-board-left-container">
                                <div className="create-board-each-board-image-container">
                                    {
                                    board.imageUrl && <img src={board.imageUrl} alt="board" />
                                    }
                                </div>
                                <div className="create-board-each-board-name">
                                    {board.name}
                                </div>
                            </div>

                            <div className="detail-page-add-to-board-right-container">
                                    { board.private && 
                                    <span className="material-symbols-outlined"
                                    id="material-symbols-lock"
                                    >
                                        lock
                                    </span> }
                                    <button 
                                        className={pinInBoard(board.pins) ? "detail-page-add-to-board-save-btn-disabled" :"detail-page-add-to-board-save-btn"}
                                        onClick={() => handleSave(board)}
                                        disabled={pinInBoard(board.pins)}
                                    >
                                      {pinInBoard(board.pins) ? "Saved" : "Save"}
                                    </button>
                            </div>
                        </div>
                    ))}
                </div>
                <div 
                    className="create-board-button-container"
                    onClick={handleOpenCreateBoardForm}
                >
                    <div 
                    className="create-board-button-inner-container"
                    onClick={handleOpenCreateBoardForm}
                    >
                        <div className="create-board-icon">+</div>
                        <div>Create board</div>
                    </div>
                </div>
            </div>
    )
    
};