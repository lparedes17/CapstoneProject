import React, {Component, useRef, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.min.css';
import '../CSS/Header.css';
import { OverlayTrigger, Tooltip, Button } from 'react-bootstrap';


const Header = props => {
    const [show, setShow] = useState(false);
    const target = useRef(null);
    const imgCSS ={
        position:"absolute",
        right:"60px",
        width:"40px",
        height:"40px",
    }

    const signOutCSS = {
        position:"absolute",
        backgroundColor:'white',
        right:"10px",
        width:"40px",
        height:"40px",
    }

    const logOutCSS = {
        backgroundColor:'white',
        width:"40px",
        height:"40px",
    }

    const onSubmit = () => {
        console.log("clicked");
        window.location.href="http://accounts.spotify.com/logout"
    }

    return(
        <nav className="navbar navbar-expand-lg navbar-dark bg-light">
            <button type="button"
                    className="btn btn-default"
                    style={signOutCSS}
                    onClick={onSubmit}>
                <i className="fa fa-sign-out" ></i>
            </button>
            <OverlayTrigger
                placement={'bottom'}
                overlay={
                    <Tooltip>
                        Click on a Playlist, Album, or Artist to earn coins.
                        Every four minutes you earn 10 coins.
                    </Tooltip>
                }>
                <button type="button" className="btn btn-default"
                        style={logOutCSS}>
                    <i className="fa fa-question-circle" ></i>
                </button>
            </OverlayTrigger>

            <img src={props.user_profile.images[0].url} style={imgCSS}/>
        </nav>

    );

}

export default Header;