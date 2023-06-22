import { useDispatch } from "react-redux";
import GreyBackgroundBtn from "../../ui/Buttons/greyBackgroundBtn";
import EditPinForm from "../editPin";
import { useModal } from "../../../context/Modal";
import BlackBackgroundBtn from "../../ui/Buttons/blackBackgroundBtn";
import { deletePinThunk } from "../../../store/pins";
import { getBoardDetailThunk } from "../../../store/boards";
import "../pins.css";

export default function DeletePinForm({pinId, closeDeletePinModal, boardId}) {

    const dispatch = useDispatch();

    const { setModalContent, closeModal } = useModal();

    const handleOpenEditPinForm = () => {
        setModalContent(<EditPinForm pinId={pinId} closeEditFormModal={closeModal} boardId={boardId} />)
    };

    const handleDeletePin = async() => {
        const confirmDelete = await dispatch(deletePinThunk(pinId));

        if(confirmDelete) {
            dispatch(getBoardDetailThunk(boardId));
            closeDeletePinModal();
        }
        
    };

    return (
        <div className="delete-pin-modal-container">
            <div className="delete-pin-modal-inner-container">
                <h1 className="delete-pin-modal-title">Are you sure?</h1>

                <div className="delete-pin-warning">
                    Once you delete a Pin, you can't undo it!
                </div>

                <div className="delete-pin-btn-container">
                    <GreyBackgroundBtn
                    text={("Cancel")}
                    onClick={handleOpenEditPinForm}
                    />
                    <BlackBackgroundBtn
                    text={"Delete"}
                    onClick={handleDeletePin}
                    />
                </div>
            </div>
        </div>
    )
};