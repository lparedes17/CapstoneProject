import React,{Component} from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.min.css';
import '../CSS/Header.css';
import App from "../App";
import axios from 'axios';

class WildCatCoins extends Component{

    constructor(props){
        super(props);
        this.state = {
            id: "",
            coins: 0,
            user_ms: 0,
            timer:null,
            database:{
                spotify_country: '',
                spotify_name: '',
                spotify_email: '',
                spotify_id: '',
                spotify_ms: 0,
                spotify_coins: 0,
                spotify_playlist: {},
                spotify_artist: {},
                spotify_album: {},
                spotify_multiplier_playlist:1,
                spotify_multiplier_artist:1,
                spotify_multiplier_album:1,
            },
            convertToCoin:0,
            multiplier: 10,
            resultCoin: 0,
        }

        this.updateCoins = this.updateCoins.bind(this);
        this.startUserMS = this.startUserMS.bind(this);
        this.tick = this.tick.bind(this);
    }
    componentDidMount() {

        this.startUserMS();
        this.setState({
            timer: setInterval(() => this.tick(), 1000),
        })
    }

    componentWillUnmount() {
        clearInterval(this.state.timer);
    }

    tick(){
        axios.get('http://localhost:4000/spotifys')
            .then(res =>{
                console.log(res.data[0]);
                this.setState({
                    id:res.data[0]._id,
                    database: {
                        spotify_country:  res.data[0].spotify_country,
                        spotify_name: res.data[0].spotify_name,
                        spotify_email: res.data[0].spotify_email,
                        spotify_id: res.data[0].spotify_id,
                        spotify_ms: res.data[0].spotify_ms,
                        spotify_coins: res.data[0].spotify_coins,
                        spotify_playlist: res.data[0].spotify_playlist,
                        spotify_artist: res.data[0].spotify_artist,
                        spotify_album: res.data[0].spotify_album,
                        spotify_multiplier_playlist:res.data[0].spotify_multiplier_playlist,
                        spotify_multiplier_artist:res.data[0].spotify_multiplier_artist,
                        spotify_multiplier_album:res.data[0].spotify_multiplier_album

                    }
                })

                console.log(this.state.database);
                console.log(this.state.id);
                if(this.props.is_playing == true) {
                    this.startUserMS();
                    this.updateCoins();
                }
            });



    }

    startUserMS(){
        this.setState({
            user_ms: this.state.user_ms + 1000,
            database:{
                spotify_country:  this.state.database.spotify_country,
                spotify_name: this.state.database.spotify_name,
                spotify_email: this.state.database.spotify_email,
                spotify_id: this.state.database.spotify_id,
                spotify_ms: this.state.user_ms,
                spotify_coins: this.state.database.spotify_coins,
                spotify_playlist: this.state.database.spotify_playlist,
                spotify_artist: this.state.database.spotify_artist,
                spotify_album: this.state.database.spotify_album,
                spotify_multiplier_playlist:this.state.database.spotify_multiplier_playlist,
                spotify_multiplier_artist:this.state.database.spotify_multiplier_artist,
                spotify_multiplier_album:this.state.database.spotify_multiplier_album
            }
        })
        console.log(this.state.database);
    }


    updateCoins(){
        let convertToCoin = (this.state.user_ms / 240000).toFixed(0);
        console.log(convertToCoin);
        let multiplier = (10 * this.state.database.spotify_multiplier_album * this.state.database.spotify_multiplier_playlist * this.state.database.spotify_multiplier_artist).toFixed(0);

        console.log(multiplier);
        let resultCoin = convertToCoin * multiplier;
        this.setState({
            coins:resultCoin
        })
        if(convertToCoin == 0){
            this.setState({
                database:{
                    spotify_country:  this.state.database.spotify_country,
                    spotify_name: this.state.database.spotify_name,
                    spotify_email: this.state.database.spotify_email,
                    spotify_id: this.state.database.spotify_id,
                    spotify_ms: this.state.database.spotify_ms,
                    spotify_coins: resultCoin,
                    spotify_playlist: this.state.database.spotify_playlist,
                    spotify_artist: this.state.database.spotify_artist,
                    spotify_album: this.state.database.spotify_album,
                    spotify_multiplier_playlist:this.state.database.spotify_multiplier_playlist,
                    spotify_multiplier_artist:this.state.database.spotify_multiplier_artist,
                    spotify_multiplier_album:this.state.database.spotify_multiplier_album
                }

            })

        }

        console.log(this.state.database);
        axios.post('http://localhost:4000/spotifys/update/' + this.state.id, this.state.database)
            .then(res =>{
                console.log(res.data);
            });
        axios.get('http://localhost:4000/spotifys/' + this.state.id).then(res =>{
            console.log(res.data);
        })
        console.log(resultCoin);

    }

    render() {
        return (
            <div className="App">
                <i className="fa fa-usd">{this.state.coins}/
                    {this.state.user_ms}/
                    {this.props.progress_ms}</i>
            </div>
        );
    }
}

export default WildCatCoins;