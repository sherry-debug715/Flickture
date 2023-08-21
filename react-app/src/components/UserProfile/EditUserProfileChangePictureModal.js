import "./userProfile.css";


export default function ChangePictureModal ({ closeModal, setImageFile, setProfileUrl }) {

    const updateFiles = e => {
        const file = e.target.files[0];
        setImageFile(file);

        const fr = new FileReader();
        if(file instanceof Blob) {
            fr.readAsDataURL(file);
            fr.addEventListener('load', () => {
                const url = fr.result;           
                setProfileUrl(url)  
            });
        };
        closeModal();
    };

    const buttonEvent = () => {
        const fileElem = document.getElementById("fileElem");
        fileElem.click();
    };

    return (
        <div className="change-picture-modal-main-container">
            <span 
                className="material-symbols-rounded"
                id="material-symbols-close-change-picture-modal"
                onClick={() => closeModal()}
            >
            close
            </span> 
            <h1 className="change-picture-modal-title">Change your picture</h1>
            <div className="change-picture-modal-button-container">
                <input type="file" onChange={updateFiles} style={{display:'none'}} id="fileElem" />
                <button id="fileSelect" onClick={buttonEvent} >
                    <span className="material-symbols-outlined">
                        file_upload
                    </span>
                    <span className="upload-button">Upload</span>
                </button>
            </div>
        </div>
    );
};