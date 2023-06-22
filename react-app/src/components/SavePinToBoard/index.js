import { useEffect, useState } from "react";
import { Tooltip } from 'react-tooltip'
import { useSelector, useDispatch } from "react-redux";
import { getAllUserBoardsThunk } from "../../store/boards";
import "./savePinToBoard.css";

export default function SavePinToBoard({setSelectedBoardId, boardPinBelongsTo}) {
    const [showMenu, setShowMenu] = useState(false);
    const dispatch = useDispatch();
    const userBoards = useSelector(state => state.boards.allBoards);
    const userBoardsArr = Object.values(userBoards);
    const [selectedBoard, setSelectedBoard] = useState("All Pins");

    function pinAlreadyInBoard(boardId){
        if(boardPinBelongsTo) {
            const boardPinBelongsToId = boardPinBelongsTo.map(board => board.id);
            return boardPinBelongsToId.includes(boardId);
        };
        return false;
    };



    useEffect(() => {
        dispatch(getAllUserBoardsThunk());
    },[dispatch]);

    const openMenu = (e) => {
        e.stopPropagation()
        setShowMenu(prev => !prev);
    };

    useEffect(() => {
        if (!showMenu) return;
    
        const closeMenu = () => {
          setShowMenu(false);
        };
    
        document.addEventListener('click', closeMenu);
      
        return () => document.removeEventListener("click", closeMenu);
      }, [showMenu]);

      const organizedUserBoards = [];
      userBoardsArr.forEach(board => {
        const eachBoard = {};
        eachBoard.id = board.id;
        eachBoard.name = board.name;
        if(board.pins.length) {
            let firstPin = board.pins[0];
            eachBoard.imageUrl = firstPin.pin_images[0].image_url;
        } else eachBoard.imageUrl = null;
        eachBoard.private = board.private;
        organizedUserBoards.push(eachBoard);
      });


    const dropDown = (
        <div className="create-board-dropdown-container">
            <div>All boards</div>
            <div className="create-board-dropdown-inner-container">
                {organizedUserBoards.map(board => (
                    <div 
                        data-tooltip-id="my-tooltip"
                        data-tooltip-content={pinAlreadyInBoard(board.id) ? "pin already belongs to this board" : ""}
                        className={!pinAlreadyInBoard(board.id) ?"create-board-each-board-container" : "create-board-each-board-container-disabled"} 
                        key={board.id}
                        onClick={() => {
                            if(!pinAlreadyInBoard(board.id)) {
                                setSelectedBoard(board.name)
                                setSelectedBoardId(board.id)
                            }
                        }}
                    >
                        <Tooltip id="my-tooltip" />
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

                        <div className="create-board-each-board-right-container">
                                { board.private && 
                                <span className="material-symbols-outlined"
                                id="material-symbols-lock"
                                >
                                    lock
                                </span> }
                        </div>
                    </div>
                ))}
            </div>
            <div className="create-board-button-container">
                <div className="create-board-button-inner-container">
                    <div className="create-board-icon">+</div>
                    <div>Create board</div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="create-board-main-container">
            <div className="create-board-selection-container">
                <div className={!showMenu ? "create-board-unselected" : "create-board-selected"} onClick={openMenu}>

                    <div className="create-board-selected-container">
                        <div className="create-board-selected-board-context">{selectedBoard}</div>
                        
                        <div className="create-board-selected-icon">
                            <span 
                                className="material-symbols-outlined"
                                id="material-symbols-expand-more"
                            >
                                expand_more
                            </span>
                        </div>
                    </div>

                </div>
                {!showMenu && <div className="create-board-save-btn">
                    Save
                </div>}
            </div>
            {showMenu && dropDown}
        </div>
    );
};