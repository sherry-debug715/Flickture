import { Link } from "react-router-dom";
import "./landing.css";


export default function Landing() {
    const images = ["https://cdn.discordapp.com/attachments/900530365754638400/1117176153044689017/Screen_Shot_2023-06-10_at_3.35.36_PM.png",
    "https://cdn.discordapp.com/attachments/900530365754638400/1117176151807377408/Screen_Shot_2023-06-10_at_3.38.03_PM.png",
    "https://cdn.discordapp.com/attachments/900530365754638400/1117176152356814858/Screen_Shot_2023-06-10_at_3.36.52_PM.png",
    "https://cdn.discordapp.com/attachments/900530365754638400/1117176153044689017/Screen_Shot_2023-06-10_at_3.35.36_PM.png"
    ];


    return (
        <div className="landing-page-container">
            {images.map((image, idx) => (              
                <img className="carousel" src={image} alt="carousel" key={idx} />             
            ))}
            <div className="landing-page-content-container">
                <h1>Find your inspiration</h1>
                <h3>Join the Flickture community</h3>
                <Link to="/explore" id="landing-page-explore-link">Explore</Link>
            </div>
        </div>
    );
};