import React from "react";
import "../CSS/Player.css";
import 'bootstrap/dist/css/bootstrap.css';

const Player = (props) => {
    let backgroundStyles = {
        backgroundImage:`url(${props.item.album.images[0].url})`,
    };

    let progressBarStyles = {
        width: (props.progress_ms * 100 / props.item.duration_ms)+ '%',
        color:'black',
        backgroundColor:'darkgray',
    };

    return (
        <div>
            <div className="main-wrapper">
                <div className="now-playing__img">
                    <img src={props.item.album.images[0].url} />
                </div>
                <div className="now-playing__side">
                    <div className="now-playing__name">{props.item.name}</div>
                    <div className="now-playing__artist">
                        {props.item.album.artists[0].name}
                    </div>
                    <div className="now-playing__status">
                        {props.is_playing ? "Playing" : "Paused"}
                    </div>
                    <div className="progress">
                        <div className="progress__bar" style={progressBarStyles}/>{" "}
                    </div>

                </div>
                <div className="background" style={backgroundStyles}/>
            </div>
        </div>
    );
}

export default Player;