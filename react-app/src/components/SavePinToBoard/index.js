import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAllUserBoardsThunk } from "../../store/boards";
import "./savePinToBoard.css";

export default function SavePinToBoard({setSelectedBoardId}) {
    const [showMenu, setShowMenu] = useState(false);
    const dispatch = useDispatch();
    const userBoards = useSelector(state => state.boards.allBoards);
    const userBoardsArr = Object.values(userBoards);
    const [selectedBoard, setSelectedBoard] = useState("All Pins");


    useEffect(() => {
        dispatch(getAllUserBoardsThunk());
    },[dispatch]);


    const openMenu = () => {
        if (showMenu) return;
        setShowMenu(true);
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
                        className="create-board-each-board-container" 
                        key={board.id}
                        onClick={() => {
                            setSelectedBoard(board.name)
                            setSelectedBoardId(board.id)
                        }}
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
