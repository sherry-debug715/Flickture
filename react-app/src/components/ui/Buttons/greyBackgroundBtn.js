import "./buttons.css"

export default function GreyBackgroundBtn({text, onClick}) {
    return (
        <div 
            className="grey-background-btn-container"
            onClick={onClick}
        >
            {text}
        </div>
    );
};