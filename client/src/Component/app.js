import React, { Component }  from 'react';
import logo from "./logo.svg";
import './App.css';
import { authEndpoint, clientId, redirectUri, scopes } from "./config_example";
import hash from "./hash";
import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.min.css';
import axios from 'axios';
import Player from "./Component/Player";
import Header from "./Component/Header";
import WildCatCoins from "./Component/WildCatCoins";
import Play from "./Component/Play";
import Playlist from "./Component/Playlist";
import Album from "./Component/Album";
import Artist from "./Component/Artist";
import ErrorBoundary from "./Component/ErrorBoundary";
import * as $ from 'jquery';

class app extends Component {
  constructor() {
    super();
    this.state = {
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
      token: null,
      refresh_token: null,
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
    this.getCurrentlyPlaying = this.getCurrentlyPlaying.bind(this);
    this.getUserPhotoID = this.getUserPhotoID.bind(this);
    this.setDatabaseSchema = this.setDatabaseSchema(this);
    this.tick = this.tick.bind(this);
  }

  componentDidMount() {
    // Set token
    let _token = hash.access_token;
    let _refreshtoken = hash.refresh_token;
    if (_token) {
      // Set token
      this.setState({
        token: _token,
        refresh_token: _refreshtoken,
      });
      this.generateRandomLetter();
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
    if(this.state.token){
      this.generateRandomGenreSeed(this.state.token);
      this.getListOfCategories(this.state.token);
      this.getListOfPlaylist(this.state.token);
      this.getListOfAlbum(this.state.token);
      this.getListOfArtist(this.state.token);
      this.getUserPhotoID(this.state.token);
      this.getCurrentlyPlaying(this.state.token);
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
              genres: data.genres,
            })
            console.log(this.state.genres[1]);
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

  setDatabaseSchema(){

    return;
  }
  render() {
    return (
        <div className="App">

          <header className="App-header">

            {!this.state.token && (
                <div>
                  <img src={logo} className="App-logo" alt="logo"/><br/>
                  <a className="btn btn-link"
                     href={`${authEndpoint}?redirect_uri=${redirectUri}&client_id=${clientId}&scope=${scopes.join("%20")}&response_type=token&show_dialog=true`}
                  >
                    Login to Spotify
                  </a>
                </div>

            )}
            {this.state.token && !this.state.no_data &&(
                <div style={{width:"100%",height:"100%"}}>
                  <Header
                      user_profile={this.state.user_profile}
                  />
                  <br/>
                  <WildCatCoins
                      playlistlimit={this.state.randomOffsetPlaylist}
                      albumlimit = {this.state.randomOffsetArtist}
                      artistlimit = {this.state.randomOffsetArtist}
                      is_playing = {this.state.is_playing}
                      progress_ms={this.state.progress_ms}
                      item={this.state.item}
                  />
                  <br/>
                  <ErrorBoundary>
                    <Playlist
                        playlist={this.state.playlist}
                        device_id={this.state.device_id}
                        access_token={this.state.token}
                        randomCategory={this.state.randomOffSetCategory}
                        randomPlaylist={this.state.randomOffsetPlaylist}
                        randomArtist={this.state.randomOffsetArtist}
                    />

                    <Artist
                        artist={this.state.artist}
                        device_id={this.state.device_id}
                        access_token={this.state.token}
                        randomCategory={this.state.randomOffSetCategory}
                        randomPlaylist={this.state.randomOffsetPlaylist}
                        randomArtist={this.state.randomOffsetArtist}
                    />
                    <Album
                        album={this.state.album}
                        device_id={this.state.device_id}
                        access_token={this.state.token}
                        randomCategory={this.state.randomOffSetCategory}
                        randomPlaylist={this.state.randomOffsetPlaylist}
                        randomArtist={this.state.randomOffsetArtist}
                    />
                  </ErrorBoundary>
                  <Player
                      item={this.state.item}
                      is_playing={this.state.is_playing}
                      progress_ms={this.state.progress_ms}

                  />

                  <Play
                      device_id={this.state.device_id}
                      item ={this.state.item}
                      access_token={this.state.token}
                      progress_ms={this.state.progress_ms}
                      context_uri={this.state.context_uri}
                  />
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
    );
  }
}

export default app;