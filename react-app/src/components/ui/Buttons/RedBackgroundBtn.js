import "./buttons.css";

export default function RedBackgroundBtn({text, onClick}) {
    return (
        <div className="red-background-btn-container" onClick={onClick}>
            {text}
        </div>
    )
};