import React, { Component }  from 'react';
import logo from "../logo.svg";
import '../App.css';
import {Buffer} from 'buffer';
import {authEndpoint, clientId, clientSecret, redirectUri, scopes} from "../config_example";
import hash from "../hash";
import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.min.css';
import {useLocation} from "react-router-dom";
import axios from 'axios';
import Player from "./Player";
import Header from "./Header";
import WildCatCoins from "./WildCatCoins";
import Play from "./Play";
import Playlist from "./Playlist";
import Album from "./Album";
import Artist from "./Artist";
import ErrorBoundary from "./ErrorBoundary";
import * as $ from 'jquery';

class Verify extends Component{

    componentDidMount() {
        const search = this.props.location.search;;
        const code = new URLSearchParams(search).get('code');

        console.log(code);
        console.log("Hello!");
        this.testToken(code);
    }

    testToken(code){

        $.ajax({
            url:'https://accounts.spotify.com/api/token',
            type: "POST",
            dataType:"json",
            beforeSend: (xhr) =>{

                xhr.setRequestHeader("Authorization", "Basic " + (Buffer.from(clientId + ':' + clientSecret).toString('base64')));
            },
            data: {
                code: code,
                redirect_uri: "http://localhost:3000/verify",
                grant_type: 'authorization_code'
            },
            success: (data) =>{
                console.log("test token function");
                console.log(data);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(xhr.status);
                alert(thrownError);
            }
        })

    }
    render() {

        return(
            <div className="App">

                <header className="App-header">

                </header>
                <h3>Hello World!</h3>
            </div>
        )
    }
}

export default Verify;