import React, {Component, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.min.css';
import '../CSS/Header.css';
import '../App';
import defaultImage from '../spotify-logo-png-7053.png';
import Player from "./Player";
import Play from "./Play";
import axios from "axios";

class Artist extends Component{
    constructor(props){
        super(props)
        this.state = {
            double:false,
        }
    }

    getPlayback = (props) =>{
        fetch('https://api.spotify.com/v1/me/player/play?device_id='+this.props.device_id, {
            method: 'PUT',
            body: JSON.stringify({
                context_uri: this.props.artist.items[0].uri,
                position_ms: 0,
                position:0,

            }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.props.access_token}`
            },
        }).then((data) => {

            console.log(data);
            this.setState(
                {
                    double:true,
                }
            )
            axios.get('http://localhost:4000/spotifys').then(res =>{
                console.log(res.data);
                let database = res.data[0];
                let id = res.data[0]._id;
                database.spotify_multiplier_artist = this.assignMultiplier(this.props.randomArtist);

                axios.post('http://localhost:4000/spotifys/update/' + id, database).then(res =>{
                    console.log(res.data);
                })
            })




        })
    }

    assignMultiplier(param){
        if(param == 1 ){
            return(1.10);
        }else if(param == 2){
            return(1.20);
        }else if(param == 3){
            return(1.30);
        }else if(param == 4){
            return(1.40);
        }else if(param == 5){
            return(1.50);
        }

    }


    render() {
        return(
            <div className="App">
                <img src={this.props.artist.items[0].images[0].url} style={{width:'100px',height:'100px'}} onError={e => e.target.src = defaultImage}/>
                <br/>
                <button onClick={this.getPlayback} disabled={this.state.double}>Play Artist</button>

            </div>

        )
    }
}


export default Artist;