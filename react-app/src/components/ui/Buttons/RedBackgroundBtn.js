import "./buttons.css";

export default function RedBackgroundBtn({text, onClick, disabled}) {
    return (
        <button 
            className={!disabled() ? "red-background-btn-container" : "red-background-btn-container-disabled"} 
            disabled={disabled()}
            onClick={onClick}>
            {text}
        </button>
    )
};