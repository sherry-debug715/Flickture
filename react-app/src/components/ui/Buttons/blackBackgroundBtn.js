import "./buttons.css"

export default function BlackBackgroundBtn({text, onClick}) {
    return (
        <div 
            className="black-background-btn-container"
            onClick={onClick}
        >
            {text}
        </div>
    );
};