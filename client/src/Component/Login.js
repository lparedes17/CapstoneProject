import logo from "../logo.svg";
import {authEndpoint, clientId, redirectUri, scopes} from "../config_example";
import React, {Component} from "react";
import hash from "../hash";
import axios from "axios";

class Login extends Component{

    render() {
        return(
            <div className="App">

                <header className="App-header">
                    <div>
                        <img src={logo} className="App-logo" alt="logo"/><br/>
                        <a className="bg-success text-white btn btn-link"
                           href={`${authEndpoint}?redirect_uri=${redirectUri}&client_id=${clientId}&scope=${scopes.join("%20")}&response_type=token&show_dialog=true`}
                        >
                            Login to Spotify
                        </a>
                    </div>
                </header>
            </div>
        )
    }
}

export default Login