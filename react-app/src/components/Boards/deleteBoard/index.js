import { useDispatch, useSelector } from "react-redux";
import BlackBackgroundBtn from "../../ui/Buttons/blackBackgroundBtn";
import GreyBackgroundBtn from "../../ui/Buttons/greyBackgroundBtn";
import { deleteBoardThunk } from "../../../store/boards";
import "../boards.css";

export default function DeleteBoardForm({numOfPins,boardId,boardName,closeDeleteBoardModal, history}) {
    const handleCancel = () => closeDeleteBoardModal();

    const dispatch = useDispatch();

    const sessionUserId = useSelector(state => state.session.user.id);

    const handleDelete = () => {
        dispatch(deleteBoardThunk(boardId))
        .then(() => closeDeleteBoardModal())
        history.push(`/userProfile/${sessionUserId}`);
    };


    return (
        <div className="delete-board-form-container">
            <div className="delete-board-form-inner-container">
                <h1 className="delete-board-form-title">Delete thie board</h1>

                <div className="delete-board-form-warning">
                    The board {boardName} and {numOfPins} {numOfPins > 1 ? "pins" : "pin"} will be removed from your profile.<br />
                    Once you delete the board, you can't undo it!
                </div>
            
                <div className="delete-board-form-btn-container">
                    <GreyBackgroundBtn 
                        text={"Cancel"}
                        onClick={handleCancel}
                    />
                    <BlackBackgroundBtn 
                        text={"Delete"}
                        onClick={handleDelete}
                    />
                </div>
            </div>
        </div>
    )
};