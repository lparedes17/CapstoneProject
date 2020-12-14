import React, { Component }  from 'react';
import logo from "../logo.svg";
import '../App.css';
import {Buffer} from 'buffer';
import {authEndpoint, clientId, clientSecret, redirectUri, scopes} from "../config_example";
import hash from "../hash";
import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.min.css';
import axios from 'axios';
import Player from "./Player";
import Header from "./Header";
import WildCatCoins from "./WildCatCoins";
import Play from "./Play";
import Playlist from "./Playlist";
import Album from "./Album";
import Artist from "./Artist";
import * as $ from 'jquery';

class Home extends Component{
    constructor(props) {
        super(props)
        this.state = {
            access_token: this.props.atoken,
            refresh_token: this.props.refresh_token,
            token_type: this.props.token_type,
            inDatabase:false,
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
                spotify_multiplier_album:1
            },
            user_profile:{
                country: 'NA',
                display_name: "NA",
                email:"na@gmail.com",
                external_urls:{
                    spotify: "NA",
                },
                id:"na",
                images:[{
                    url:""
                }],

            },
            category_id:"",
            category:{
                items:[{
                    icons:[{
                        url:"",
                    }],
                    id:"",
                    name:"",
                }],

            },
            playlist:{
                items:[{
                    images:[{
                        url:""
                    }],
                    uri:"",
                }],
                limit:0,


            },
            device_id:"",
            context_uri:"",
            item: {
                album: {
                    artists: [{ name: "" }],
                    images: [{ url: "" }]

                },
                name: "",
                duration_ms: 0
            },
            album:{
                items:[{
                    images:[
                        {
                            url:"",
                        }
                    ],

                }],


            },
            artist:{
                items:[{
                    images:[
                        {
                            url:"",
                        }
                    ]
                }],


            },
            is_playing: "Paused",
            progress_ms: 0,
            no_data: false,
            randomOffSetCategory: (Math.random() * 50).toFixed(0),
            randomOffsetPlaylist: (Math.random() * 10).toFixed(0),
            randomOffsetArtist: (Math.random()*5).toFixed(0),
            randomAlpha: this.generateRandomLetter(),
            updatedDatabase:false,
        };
        this.generateRandomLetter = this.generateRandomLetter.bind(this);
        this.generateRandomGenreSeed = this.generateRandomGenreSeed.bind(this);
        this.getListOfAlbum = this.getListOfAlbum.bind(this);
        this.getListOfArtist = this.getListOfArtist.bind(this);
        this.getListOfCategories = this.getListOfCategories.bind(this);
        this.getListOfPlaylist = this.getListOfPlaylist.bind(this);
        this.getCurrentlyPlaying = this.getCurrentlyPlaying.bind(this);
        this.getUserPhotoID = this.getUserPhotoID.bind(this);
        this.tick = this.tick.bind(this);
    }

    componentDidMount() {
        // Set token
        const _token = this.props.atoken;
        console.log(_token);
        if (_token) {

            this.generateRandomGenreSeed(_token);
            this.getListOfCategories(_token);
            this.getListOfPlaylist(_token);
            this.getListOfArtist(_token);
            this.getListOfAlbum(_token);
            this.getUserPhotoID(_token);
            this.getCurrentlyPlaying(_token);

        }

        this.interval = setInterval(() => this.tick(), 10000)
        console.log(this.state.user_profile);
        axios.get('http://localhost:4000/spotifys').then(res=>{
            if(res.data.length == 0){
                axios.post('http://localhost:4000/spotifys/add', this.state.database)
                    .then(res => {
                        console.log(res);
                    });
            }
        })

    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    tick(){
        if(this.state.access_token){
            this.getListOfCategories(this.state.access_token);
            this.getListOfPlaylist(this.state.access_token);
            this.getListOfAlbum(this.state.access_token);
            this.getListOfArtist(this.state.access_token);
            this.getUserPhotoID(this.state.access_token);
            this.getCurrentlyPlaying(this.state.access_token);
        }

    }



    generateRandomLetter() {
        const alphabet = "abcdefghijklmnopqrstuvwxyz"

        return alphabet[Math.floor(Math.random() * alphabet.length)]
    }

    generateRandomGenreSeed(token){
        $.ajax({
                url:'https://api.spotify.com/v1/recommendations/available-genre-seeds',
                type: 'GET',
                beforeSend: (xhr) => {
                    xhr.setRequestHeader('Authorization','Bearer ' + token);

                },
                success:(data) =>{

                    this.setState({
                        genres: data.genres[0],
                    })
                    console.log(this.state.genres);
                }

            }
        );
    }
    getListOfArtist(token){
        $.ajax({
            url:`https://api.spotify.com/v1/search?q=${this.state.randomAlpha}&type=artist&limit=1&offset=${this.state.randomOffsetArtist}`,
            type: "GET",
            beforeSend: (xhr) =>{

                xhr.setRequestHeader("Authorization", "Bearer " + token);
            },
            success: (data) =>{

                this.setState({
                    artist: data.artists,
                })
                console.log(this.state.artist);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(xhr.status);
                alert(thrownError);
            }
        })
    }
    getListOfAlbum(token){

        $.ajax({
            url:`https://api.spotify.com/v1/search?q=${this.state.randomAlpha}&type=album&limit=1&offset=${this.state.randomOffsetArtist}`,
            type: "GET",
            beforeSend: (xhr) =>{

                xhr.setRequestHeader("Authorization", "Bearer " + token);
            },
            success: (data) =>{

                this.setState({
                    album: data.albums,
                })
                console.log(this.state.album);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(xhr.status);
                alert(thrownError);
            }
        })

    }


    getListOfCategories (token) {

        $.ajax({
            url: `https://api.spotify.com/v1/browse/categories?limit=1&offset${this.state.randomOffSetCategory}`,
            type: "GET",
            beforeSend: (xhr) => {
                xhr.setRequestHeader("Authorization", "Bearer " + token);
            },
            success: (data) => {

                this.setState({
                    category: data.categories,
                    category_id: data.categories.items[0].id,
                });
                this.getListOfPlaylist(token)
                console.log(this.state.category);
            }
        });


    }
    getListOfPlaylist(token){
        $.ajax({
            url: `https://api.spotify.com/v1/browse/categories/${this.state.category_id}/playlists?limit=1&offset=${this.state.randomOffsetPlaylist}`,
            type: "GET",
            beforeSend: (xhr) => {
                xhr.setRequestHeader("Authorization", "Bearer " + token);
            },
            success: (data) => {
                if (!data) {
                    this.setState({
                        no_data: true,
                    })
                } else {
                    console.log(data.playlists)
                    this.setState({
                        playlist: data.playlists,
                    });


                    console.log(this.state.playlist);
                }
            }
        });

    }

    getUserPhotoID(token){
        $.ajax({
            url:"https://api.spotify.com/v1/me",
            type: "GET",
            beforeSend: (xhr) =>{

                xhr.setRequestHeader("Authorization", "Bearer " + token);
            },
            success: (data) =>{
                this.setState({
                    user_profile: data,
                })
                console.log(data);
            }
        })
    }
    getCurrentlyPlaying(token) {
        // Make a call using the token
        $.ajax({
            url: "https://api.spotify.com/v1/me/player",
            type: "GET",
            beforeSend: (xhr) => {
                xhr.setRequestHeader("Authorization", "Bearer " + token);
            },
            success: (data) => {
                if(!this.state.updatedDatabase){
                    this.state.database.spotify_country = this.state.user_profile.country;
                    this.state.database.spotify_name = this.state.user_profile.display_name;
                    this.state.database.spotify_email = this.state.user_profile.email;
                    this.state.database.spotify_id = this.state.user_profile.id;
                    this.state.database.spotify_artist = this.state.artist;
                    this.state.database.spotify_album = this.state.album;
                    this.state.database.spotify_playlist = this.state.playlist;
                    console.log(this.state.playlist);
                    console.log(this.state.database);
                    axios.get('http://localhost:4000/spotifys').then(res => {
                        console.log(res.data);
                        console.log(res.data[0]._id);
                        this.setState({
                            id: res.data[0]._id
                        })

                        console.log(this.state.id);
                        console.log(this.state.database);
                        axios.post('http://localhost:4000/spotifys/update/' + this.state.id, this.state.database).then(res=>{
                            console.log(this.state.database);
                            console.log(res.data);
                        })
                        axios.get('http://localhost:4000/spotifys').then(res =>{
                            console.log(res.data[0]);
                        })
                    })
                    this.setState({updatedDatabase:true})
                }

                if(!data){
                    this.setState({
                        no_data:true,
                    })
                }else{
                    this.setState({
                        device_id: data.device.id,
                        context_uri:data.context_uri,
                        no_data:false,
                        item: data.item,
                        is_playing: data.is_playing,
                        progress_ms: data.progress_ms,
                    });


                }


            }});


    }

    render() {
        return(
            <div className="App">

                <header className="App-header">
                    {this.state.access_token && !this.state.no_data &&(
                        <div style={{width:"100%"}}>
                            <Header
                                user_profile={this.state.user_profile}
                            />
                            <br/>
                            <div class="row mx-md-5">
                                <div class=" shadow p-3 mb-5 bg-info col px-md-5 rounded">
                                    <WildCatCoins
                                        playlistlimit={this.state.randomOffsetPlaylist}
                                        albumlimit = {this.state.randomOffsetArtist}
                                        artistlimit = {this.state.randomOffsetArtist}
                                        is_playing = {this.state.is_playing}
                                        progress_ms={this.state.progress_ms}
                                        item={this.state.item}
                                    />
                                </div>
                                <div class=" shadow p-3 mb-5 bg-info col px-md-5 rounded offset-1">
                                    <h2>Select either Playlist, Album or Artist to listen to.</h2>
                                    <div class="row px-md-5">
                                        <div className="col">
                                            <Playlist
                                                playlist={this.state.playlist}
                                                device_id={this.state.device_id}
                                                access_token={this.state.access_token}
                                                randomCategory={this.state.randomOffSetCategory}
                                                randomPlaylist={this.state.randomOffsetPlaylist}
                                                randomArtist={this.state.randomOffsetArtist}
                                            />
                                        </div>
                                        <div className="col">
                                            <Artist
                                                artist={this.state.artist}
                                                device_id={this.state.device_id}
                                                access_token={this.state.access_token}
                                                randomCategory={this.state.randomOffSetCategory}
                                                randomPlaylist={this.state.randomOffsetPlaylist}
                                                randomArtist={this.state.randomOffsetArtist}
                                            />
                                        </div>
                                        <div className="col">
                                            <Album
                                                album={this.state.album}
                                                device_id={this.state.device_id}
                                                access_token={this.state.access_token}
                                                randomCategory={this.state.randomOffSetCategory}
                                                randomPlaylist={this.state.randomOffsetPlaylist}
                                                randomArtist={this.state.randomOffsetArtist}
                                            />
                                        </div>
                                    </div>


                                </div>
                            </div>
                            <div class="row mx-md-5">
                                <div class="col shadow p-3 mb-5 bg-info px-md-5 rounded">
                                    <Player
                                        item={this.state.item}
                                        is_playing={this.state.is_playing}
                                        progress_ms={this.state.progress_ms}

                                    />
                                    <br/>
                                    <Play
                                        device_id={this.state.device_id}
                                        item ={this.state.item}
                                        access_token={this.state.access_token}
                                        progress_ms={this.state.progress_ms}
                                        context_uri={this.state.context_uri}
                                    />
                                </div>
                            </div>

                        </div>

                    )}
                    {this.state.no_data &&(
                        <div style={{width:"100%",height:"100%"}}>
                            <Header
                                user_profile={this.state.user_profile}
                            />
                            <br/>
                            <WildCatCoins/>
                            <br/>
                            <p>
                                You need to be playing a song on Spotify, for something to appear.
                            </p>
                        </div>

                    )}
                </header>
            </div>
        )
    }
}

export default Home;