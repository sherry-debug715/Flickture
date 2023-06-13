import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAllUserBoardsThunk } from "../../store/boards";

export default function SavePinToBoard() {
    const [showMenu, setShowMenu] = useState(false);
    const dispatch = useDispatch();
    const userBoards = useSelector(state => state.boards.allBoards);
    const userBoardsArr = Object.values(userBoards);


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
      // need boardId, name, the first pin image url, private
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

      console.log("organizedUserBoards", organizedUserBoards)
      console.log("userBoardsArr", userBoardsArr)
    
    const dropDown = (
        <div className="create-board-dropdown-container">
            <div>All boards</div>
            <div className="create-board-dropdown-inner-container">
                {organizedUserBoards.map(board => (
                    <div className="create-board-each-board-container" key={board.id}>
                        <div className="create-board-each-board-left-container">
                            <div>
                                {
                                board.imageUrl && <img src={board.imageUrl} alt="board" />
                                }
                            </div>
                            <div>
                                {board.name}
                            </div>
                        </div>

                        <div className="create-board-each-board-right-container">
                                { board.private && 
                                <span className="material-symbols-outlined">
                                    lock
                                </span> }
                        </div>
                    </div>
                ))}
            </div>
            <hr />
            <div className="create-board-button-container">
                <div>+</div>
                <div>Create board</div>
            </div>
        </div>
    );

    return (
        <>
            <div className="create-board-selected-container">
                <div className="create-board-selected" onClick={openMenu}>

                    <div>v</div>
                </div>
                <div className="create-board-save-btn">
                    Save
                </div>
            </div>
            {showMenu && dropDown}
        </>
    );
};
