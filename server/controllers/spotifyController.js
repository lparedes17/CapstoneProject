const express = require('express')
var router = express.Router()
var ObjectID = require('mongoose').Types.ObjectId

var {Spotify} = require('../models/spotify.model')

router.get('/',(req, res) =>{
    Spotify.find((err, spotifys) => {
        if (err) {
            console.log(err);
        } else {
            res.json(spotifys);
        }
    });
});

router.get('/:id',(req, res) => {
    let id = req.params.id;
    Spotify.findById(id, function(err, spotify) {
        res.json(spotify);
    });
});

router.post('/update/:id',(req, res) =>{
    Spotify.findById(req.params.id, (err, spotify) => {
        if (!spotify)
            res.status(404).send("data is not found");
        else
            spotify.spotify_country= req.body.spotify_country;
        spotify.spotify_name= req.body.spotify_name;
        spotify.spotify_email= req.body.spotify_email;
        spotify.spotify_id = req.body.spotify_id;
        spotify.spotify_coins = req.body.spotify_coins;
        spotify.spotify_ms = req.body.spotify_ms;
        spotify.spotify_album = req.body.spotify_album;
        spotify.spotify_artist = req.body.spotify_artist;
        spotify.spotify_playlist = req.body.spotify_playlist;
        spotify.spotify_multiplier_playlist = req.body.spotify_multiplier_playlist;
        spotify.spotify_multiplier_artist = req.body.spotify_multiplier_artist;
        spotify.spotify_multiplier_album = req.body.spotify_multiplier_album;

        spotify.save().then(spotify => {
            res.json('Spotify updated!');
        })
            .catch(err => {
                res.status(400).send("Update not possible");
            });
    });
});

router.post('/add',(req, res) =>{
    let spotify = new Spotify(req.body);
    spotify.save()
        .then(spotify => {
            res.status(200).json({'spotify': 'spotify added successfully'});
        })
        .catch(err => {
            res.status(400).send('adding new spotify failed');
        });
});
router.delete('/delete/:id',(req,res) =>{
    Spotify.findByIdAndRemove(req.params.id,function (err,spotify) {
        if (err) return res.status(500).send("There was a problem deleting the user.");
        res.status(200).send("User: "+ req.params.id +" was deleted.");
    });

});

module.exports = router
