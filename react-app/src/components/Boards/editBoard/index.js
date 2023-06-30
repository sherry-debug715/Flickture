import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link, useHistory } from "react-router-dom";
import RedBackgroundBtn from "../../ui/Buttons/RedBackgroundBtn";
import GreyBackgroundBtn from "../../ui/Buttons/greyBackgroundBtn";
import InputField from "../../ui/Input/InputField";
import ControlledCheckbox from "../../ui/Input/CheckBox";
import { getBoardDetailThunk } from "../../../store/boards";
import { useModal } from "../../../context/Modal";
import EditPinForm from "../../pins/editPin";
import DeleteBoardForm from "../deleteBoard";
import { editBoardThunk } from "../../../store/boards";
import EditNonUserPin from "../../pins/editPin/editNonUserPin";
import "../boards.css";

export default function EditBoardForm() {
    const dispatch = useDispatch();

    const history = useHistory();

    const sessionUserId = useSelector(state => state.session.user.id);

    const boardPins = useSelector(state => state.boards.singleBoard.pins)

    const [name, setName]= useState("");

    const [boardPrivate, setBoardPrivate] = useState(false);

    const [resetForm, setResetForm] = useState(false);

    const [onHoverPinId, setOnHoverPinId] = useState(null);

    const {boardId} = useParams();

    const { setModalContent, closeModal } = useModal();

    const [checkChangedBoardId, setCheckChangedBoardId] = useState(boardId);


    const handleOpenEditPinForm = (pinId) => {
        setModalContent(
            <EditPinForm 
            pinId={pinId} 
            closeEditFormModal={closeModal} 
            boardId={boardId} 
            setCheckChangedBoardId={setCheckChangedBoardId}
            />)
    };

    const handleOpenEditNonUserPinForm = (pin) => {
        setModalContent(
            <EditNonUserPin 
                closeEditNonUserPinForm={closeModal}  
                openLocation={"Edit your board form"}
                pin={pin}
                boardId={boardId}
            />
        );
    };

    const handleOpenDeleteBoardForm = () => {
        setModalContent(
            <DeleteBoardForm
                numOfPins={boardPins.length}
                boardId={boardId}
                boardName={name}
                closeDeleteBoardModal={closeModal}
                history={history}
            />
        )
    }

    useEffect(() => {
        dispatch(getBoardDetailThunk(boardId))
        .then(data => {
            setName(data.name);
            setBoardPrivate(data.private);
        })
    },[dispatch, resetForm, checkChangedBoardId]);

    const handleChecked = e => {
        setBoardPrivate(e.target.checked)
    };

    const handleBtnDisabled = () => !name.length;

    const handleSubmit = async() => {
        const boardToEdit = {
            name,
            private: boardPrivate
        };

        const editedBoard = await dispatch(editBoardThunk(boardToEdit, boardId));

        if(editedBoard) history.push(`/userProfile/${sessionUserId}`);
    };

    if(!boardPins) return null;

    return (
        <div className="edit-board-form-main-container">
            <div className="edit-board-form-inner-container">
                <div className="edit-board-form-inner-container2">
                    <div className="edit-board-form-header">
                        <Link to={`/userProfile/${sessionUserId}`} className="edit-board-form-arrow-back">
                            <span 
                            className="material-symbols-rounded"
                            id="material-symbols-arrow-back"
                            >
                                arrow_back
                            </span>
                        </Link>
                        <div 
                            className="clear-form-container"
                            onClick={() => setResetForm(prev => !prev)}
                        >
                            <span className="material-symbols-rounded" id="material-symbols-clear-form">
                                restart_alt
                            </span>
                        </div>
                    </div>

                    <div className="edit-board-form-content-container">
                        <h1 className="edit-board-form-title">Edit your board</h1>
                        <div className="edit-board-name-field">
                            <InputField 
                                size={{ m: 2, width: "40ch"}}
                                setter={setName}
                                val={name}
                                label={"Name"}
                                id={"standard-basic"}
                                multiline={false}
                                variant={"standard"}
                                labelFontSize={"20px"}
                            />
                        </div>

                        <div className="edit-board-form-set-private-container">
                            <div>
                                <ControlledCheckbox 
                                    checked={boardPrivate} 
                                    handleChange={handleChecked}
                                />
                            </div>
                            <div className="create-board-form-set-private-info">
                                <div className="create-board-form-set-private-info-one">
                                    Keep this board secret
                                </div>
                                <div className="create-board-form-set-private-info-two">
                                    So only you can see it.
                                </div>
                            </div>
                        </div>

                        <div className="edit-board-form-pin-container">
                            {boardPins.map(pin => (
                                <div 
                                    className="edit-board-form-pin-main-container"
                                    onMouseEnter={() => setOnHoverPinId(pin.pin_id)}
                                    onMouseLeave={() => setOnHoverPinId(null)}
                                    key={pin.pin_id}
                                >
                                    <Link
                                        to={`/explore/${pin.pin_id}`}
                                        key={pin.pin_id}
                                        className="edit-board-form-pin-inner-container"
                                    >
                                        <div className="edit-board-pin-card-container"
                                       
                                        >
                                            <img 
                                                src={pin.image_url} 
                                                alt={pin.title} 
                                                className="edit-board-pin-image"
                                            />
                                            <div>{pin.title}</div>
                                        </div>
                                    </Link>
                                    {
                                        onHoverPinId === pin.pin_id && 
                                        <div 
                                            className="edit-board-form-hover-over-container"
                                            onClick={() => {
                                                if(pin.user_id === sessionUserId) return handleOpenEditPinForm(pin.pin_id)
                                                else return handleOpenEditNonUserPinForm(pin)
                                            }}
                                        >
                                            <span 
                                                className="material-symbols-outlined"
                                                id="material-symbols-edit"
                                            >
                                                edit
                                            </span>
                                        </div>
                                    }
                                </div>
                            ))}
                        </div>

                    </div>
                    <div className="edit-board-form-btn-container">
                        <div className="edit-board-form-save-btn">
                            <RedBackgroundBtn 
                                text={"Save"}
                                disabled={handleBtnDisabled}
                                onClick={handleSubmit}
                            />
                        </div>
                        {boardId !== "76" && <div className="edit-board-form-delete-btn">
                            <GreyBackgroundBtn
                                onClick={handleOpenDeleteBoardForm}
                                text={"Delete"}
                            />
                        </div>}
                    </div>
                </div>
            </div>
        </div>
    )

};