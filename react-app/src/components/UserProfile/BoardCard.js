import { Link, useHistory } from "react-router-dom";

export default function BoardCard({board, onHoverBoardId, sessionUser, userId}) {

    const history = useHistory();

    const boardPins = () => {
        let boardPins = board.pins;
        const imageUrls = [];
        if(boardPins.length > 3) {
            boardPins = boardPins.slice(0, 3);
        };
        if(boardPins.length) {
            boardPins.forEach(pin => imageUrls.push(pin["pin_images"][0]["image_url"]));
        };
        return imageUrls;
    };

    const numOfPins = board.pins.length;

    const imageUrls = boardPins();

    let leftImage = null;
    let rightImageTop = null;
    let leftImageBottom = null;

    if(imageUrls[0]) leftImage = imageUrls[0];
    if(imageUrls[1]) rightImageTop = imageUrls[1];
    if(imageUrls[2]) leftImageBottom = imageUrls[2];

    return (
            <div className="board-card-outer-container">
                <Link 
                    className="board-card-inner-container"
                    to={`/boards/${board.id}`}
                >

                    <div 
                        className="board-profile-container"
                    >
                        <div className="board-profile-left-image-container">
                            {leftImage && <img src={leftImage} alt="profile-left" /> }
                        </div>

                        <div className="board-profile-right-image-container">
                            <div className="board-profile-right-image-container-top">
                                {rightImageTop && <img src={rightImageTop} alt="profile-top-right" />}
                            </div>

                            <div className="board-profile-right-image-container-bottom">
                                {leftImageBottom && <img src={leftImageBottom} alt="profile-bottom-right" />}
                            </div>
                        </div>
                    </div>
                </Link>

                {onHoverBoardId === board.id && sessionUser.id === userId && board.name !== "All Pins" &&  (
                <div
                    className="board-card-hover-over-container"
                    onClick={() => history.push(`/boards/edit/${board.id}`)}
                >
                    <span 
                    className="material-symbols-outlined"
                    id="material-symbols-edit"
                >
                    edit
                </span>
                </div>
                )}

                <div className="board-profile-info-container">
                    <div className="board-profile-name">
                        {board.name}
                    </div>

                    <div className="num-of-pins">
                        {numOfPins > 1 ? numOfPins+" Pins" : numOfPins+" Pin"} 
                    </div>
                </div>
            </div>

    )
};