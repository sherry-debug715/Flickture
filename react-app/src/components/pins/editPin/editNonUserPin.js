import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getAllUserBoardsThunk } from "../../../store/boards";
import CreateBoard from "../../Boards/createBoard";
import GreyBackgroundBtn from "../../ui/Buttons/greyBackgroundBtn";
import "../pins.css";
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { removeSavedPinThunk } from "../../../store/pins";
import { savePinToBoardThunk } from "../../../store/pins";
import { removePinFromBoardThunk } from "../../../store/boards";
import { savePinToBoardNoRemovalThunk } from "../../../store/pins";

const ITEM_HEIGHT = 60;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const theme = createTheme({
    palette: {
        primary: {
          main:"#36454F"
        },
      },
      typography: {
        fontSize: 15, // change the default font size
      },
  });

export default function EditNonUserPin({closeEditNonUserPinForm, openLocation, pin, boardId}) {

    const dispatch = useDispatch();

    const pinId = pin.pin_id;

    const userBoards = useSelector(state => state.boards.allBoards);

    const userBoardsArr = Object.values(userBoards);

    const sessionUser = useSelector(state => state.session.user);
    
    const [saved, setSaved] = useState(false);

    const [initialSelected, setInitialSelected] = useState([]);

    const [selectedBoards, setSelectedBoards] = useState([]);

    useEffect(() => {
        dispatch(getAllUserBoardsThunk(sessionUser.id))
        .then(data => {
            if(openLocation === "Edit your board form") {
                const userBoards = Object.values(data);
                userBoards.forEach(board => {
                    const boardPinsArr = board.pins;
                    
                    if(boardPinsArr.findIndex(pin => pin.id === pinId) !== -1) {
                        const newSelected = {id: board.id, name: board.name, private: board.private}
                        setSelectedBoards(prev => [...prev, newSelected])
                        setInitialSelected(prev => [...prev, newSelected]);  
                    };
                });
            } else return;
        });
        
    },[dispatch, saved, openLocation]);

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

    const handleSelctionChange = (event) => {
        const boardJustSelectedOrDeselected = event.target.value;
    
        const currentSelectedBoard = boardJustSelectedOrDeselected[boardJustSelectedOrDeselected.length - 1];
        const alreadySelected = selectedBoards.find(board => board.id === currentSelectedBoard.id);
    
        if (alreadySelected) {
          // If the board is already selected, remove it from the selectedBoards array
          setSelectedBoards(selectedBoards.filter(board => board.id !== currentSelectedBoard.id));
        } else {
          // If the board is not already selected, add it to the selectedBoards array
          setSelectedBoards(prevSelectedBoards => [...prevSelectedBoards, currentSelectedBoard]);
        }
    };

    const handleDelete = async() => {
        if(openLocation === "Save Pin Card") {
            const unsavePin = await dispatch(removeSavedPinThunk(pin.pin.id));
            if(unsavePin.id) closeEditNonUserPinForm();
        };

        if(openLocation === "Edit your board form") {
            const removePin = await dispatch(removePinFromBoardThunk(pinId, boardId));
            if(removePin) closeEditNonUserPinForm();
        }
    };

    const handleSave = async() => {
        const selectedBoardIds = selectedBoards.map(board => board.id);

        if(openLocation === "Save Pin Card") {
            selectedBoardIds.forEach(id => {
                dispatch(savePinToBoardThunk(pin.pin.id, id, pin.id));
            });

            handleDelete();
            setSaved(true);
        };

        if(openLocation === "Edit your board form") {
            const initalSelectedIds = initialSelected.map(board => board.id);
            const removeDup = new Set(initalSelectedIds);
            for(let boardId of removeDup) {
                if(!selectedBoardIds.includes(boardId)) dispatch(removePinFromBoardThunk(pinId, boardId));
            };

            selectedBoardIds.forEach(id => dispatch(savePinToBoardNoRemovalThunk(pinId, id)));
            setSaved(true);
            closeEditNonUserPinForm();
        };
    };
    
    return (
        <div className="edit-non-userPin-form-container">
            <div className="edit-non-userPin-form-inner-container">
                <span 
                    className="material-symbols-rounded"
                    id="material-symbols-close"
                    onClick={() => closeEditNonUserPinForm()}
                >
                    close
                </span>
                <h1 className="edit-non-userPin-form-title">Manage pin</h1>

                <div className="edit-non-userPin-form-content-container">
                    <div className="edit-non-userPin-form-left-section">
                        <img 
                        src={openLocation === "Save Pin Card" ? pin.pin.pin_images[0].image_url : pin.image_url} alt="edited-pin" 
                        />
                    </div>
                    <div className="edit-non-userPin-form-right-section">
                        <ThemeProvider theme={theme}>
                            <FormControl sx={{ m: 5, width: 300 }}>
                                <InputLabel id="demo-multiple-checkbox-label">Boards</InputLabel>
                                <Select
                                labelId="demo-multiple-checkbox-label"
                                id="demo-multiple-checkbox"
                                multiple
                                value={selectedBoards}
                                onChange={handleSelctionChange}
                                input={<OutlinedInput label={"Boards"} />}
                                renderValue={(selected) => selected.map((item) => item.name).join(', ')}
                                MenuProps={MenuProps}
                                >
                                {organizedUserBoards.map((board) => (
                                    <MenuItem key={board.id} value={board}>
                                    <Checkbox checked={selectedBoards.findIndex(item => item.id === board.id) > -1 } color="success" />
                                    
                                    <ListItemText primary={board.name} />
                                    </MenuItem>
                                ))}
                                </Select>
                            </FormControl>

                        </ThemeProvider>
                    </div>
                </div>

                <div className="edit-non-userPin-form-btn-container">
                    <div className="edit-non-userPin-form-btn-inner-container">
                        <button
                            className="red-background-btn-container"
                            onClick={handleSave}
                        >
                            Save
                        </button>
                        <GreyBackgroundBtn 
                        text={"Delete"}
                        onClick={handleDelete}
                        />
                    </div>
                </div>
            </div>
        </div>
    )

};