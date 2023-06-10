import "./buttons.css";

export default function RedBackgroundBtn({text, onClick, disabled}) {
    return (
        <button 
            className="red-background-btn-container" 
            disabled={disabled()}
            onClick={onClick}>
            {text}
        </button>
    )
};