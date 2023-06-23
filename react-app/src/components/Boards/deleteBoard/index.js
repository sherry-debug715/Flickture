import { useDispatch } from "react-redux";
import RedBackgroundBtn from "../../ui/Buttons/RedBackgroundBtn";
import GreyBackgroundBtn from "../../ui/Buttons/greyBackgroundBtn";
import "../boards.css";

export default function DeleteBoardForm({numOfPins,boardId,boardName}) {

    return (
        <div className="delete-board-form-container">
            <div className="delete-board-form-inner-container">
                <h1 className="delete-board-form-title">Delete thie board</h1>

                <div className="delete-board-form-warning">
                    The board {boardName} and {numOfPins} {numOfPins > 1 ? "pins" : "pin"} will be removed from your profile.<br />
                    Once you delete the board, you can't undo it!
                </div>
            
                <div className="delete-board-form-btn-container">
                    
                </div>
            </div>
        </div>
    )
};