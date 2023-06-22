import { useState } from "react";
import { useDispatch } from "react-redux";
import RedBackgroundBtn from "../../ui/Buttons/RedBackgroundBtn";
import InputField from "../../ui/Input/InputField";
import ControlledCheckbox from "../../ui/Input/CheckBox";
import { createBoardThunk } from "../../../store/boards";
import EditPinForm from "../../pins/editPin";
import { useModal } from "../../../context/Modal";
import "../boards.css";

export default function CreateBoard({closeCreateBoardModal, openLocation, setNewBoardName, currentPinId, setNewBoardId, boardId}) {
    const dispatch = useDispatch();

    const [name, setName] = useState("");

    const [boardPrivate, setBoardPrivate] = useState(false);

    const { setModalContent, closeModal } = useModal();
    

    const handleChecked = e => {
        setBoardPrivate(e.target.checked)
    };

    const btnDisabled = () => !name.length;

    const handleOpenEditPinForm = () => {
        if(!currentPinId) return;
        setModalContent(<EditPinForm 
            pinId={currentPinId} 
            closeEditFormModal={closeModal} 
            boardId={boardId}
        />)
    };


    const handleSubmit = async() => {
        const newBoard = {name, private:boardPrivate};
        const createdBoard = await dispatch(createBoardThunk(newBoard));
        if(createdBoard) {
            if(openLocation === "User Profile") {
                closeCreateBoardModal();
            };

            if(openLocation === "Create pin form") {
                setNewBoardName(createdBoard.name);
                setNewBoardId(createdBoard.id)
                closeCreateBoardModal();
            };
            
            if(openLocation === "Edit pin modal" ) {
                localStorage.setItem("newBoardName", createdBoard.name);
                localStorage.setItem("newBoardId", createdBoard.id);
                handleOpenEditPinForm();
            };
        };
    };

    return (
        <div className="create-board-form--container">
            <div className="create-board-form-inner-container">
                <h1 className="create-board-form-title">Create board</h1>
                <div className="create-board-name-field">
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

                <div className="create-board-form-set-private-container">
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

                <div className="create-board-form-btn-container">
                    <RedBackgroundBtn
                        text={"Create"}
                        disabled={btnDisabled}
                        onClick={handleSubmit}
                    />
                </div>

            </div>
        </div>
    )

};