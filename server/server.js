require('./db');
const express = require('express');
const server = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 4000;

const SpotifyRoutes = require('./controllers/spotifyController')

server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cors());

server.listen(PORT, ()=>{
    console.log("Server is running on Port: " + PORT);
});
server.use('/spotifys', SpotifyRoutes);
