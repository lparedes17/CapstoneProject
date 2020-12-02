import React, {Component, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.min.css';
import '../App'
import '../CSS/Header.css';
import defaultImage from '../spotify-logo-png-7053.png';
import axios from "axios";

class Playlist extends Component {

    constructor(props) {
        super(props);
        this.state = {
            double: false
        }
    }

    getPlayback = () =>{
        fetch('https://api.spotify.com/v1/me/player/play?device_id='+this.props.device_id, {
            method: 'PUT',
            body: JSON.stringify({
                context_uri: this.props.playlist.items[0].uri,
                offset:{
                    position:0,
                },
                position_ms: 0,

            }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.props.access_token}`
            },
        }).then((data) => {
            console.log(data);
            this.setState({
                double:true,
            })
            axios.get('http://localhost:4000/spotifys').then(res =>{
                console.log(res.data);
                let database = res.data[0];
                console.log(database);
                let id = res.data[0]._id;
                database.spotify_multiplier_artist = this.assignMultiplier(this.props.randomCategory);

                axios.post('http://localhost:4000/spotifys/update/' + id, database).then(res =>{
                    console.log(res.data);
                })
            })

        })
    }

    assignMultiplier(param){
        if(param >= 0 && param <10){
            return(1.10);
        }else if(param >=10 && param < 20 ){
            return(1.20);
        }else if(param >=20 && param < 30){
            return(1.30);
        }else if(param >= 30 && param <40){
            return(1.40);
        }else if(param >=40 && param < 50){
            return(1.50);
        }

    }
    render(){
        return (
            <div className="App">
                <img src={this.props.playlist.items[0].images[0].url} style={{width:"100px",height:"100px"}} onError={e => e.target.src = defaultImage}/>
                <br/>
                <button onClick={
                    this.getPlayback
                } disabled={this.state.double}>Play Playlist
                </button>
            </div>
        )

    }
}







export default Playlist;