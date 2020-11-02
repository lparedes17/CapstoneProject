const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Spotifys = new Schema({
    spotify_country: {
        type: String
    },
    spotify_name: {
        type: String
    },
    spotify_email: {
        type: String
    },
    spotify_id: {
        type: String
    },
    spotify_ms:{
        type:Number
    },
    spotify_coins:{
        type:Number
    },
    spotify_playlist:{
        type: JSON
    },

    spotify_artist:{
        type:JSON
    },

    spotify_album:{
        type:JSON
    },
    spotify_multiplier_playlist:{
        type: Number
    },
    spotify_multiplier_artist:{
        type: Number
    },
    spotify_multiplier_album:{
        type: Number
    }
});

var Spotify = mongoose.model('Spotify', Spotifys, 'spotifys');
module.exports = {Spotify};