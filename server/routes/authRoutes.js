const express = require('express')
const router = express.Router();
const fetch = require("node-fetch");
const request = require('request'); // "Request" library
const cors = require('cors');
const cookieParser = require('cookie-parser');
const encodeFormData = require("../helperFunction/encodedFormData");
const querystring = require("querystring");

const clientId = "d0ffa7069c934d4fbc9eeb83ae9bffa8";
const clientSecret = "2f4592bdb803494fa0fb2ebd840773d8";
const redirectUri = "http://localhost:3000/logged";
const scopes = [
    "user-read-private",
    "user-top-read",
    "user-read-currently-playing",
    "user-read-playback-state",
];

var generateRandomString = function(length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

var stateKey = 'spotify_auth_state';



router.get('/login',async (req,res)=>{
    var state = generateRandomString(16);
    res.cookie(stateKey, state);
    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: clientId,
            scope: scopes,
            redirect_uri: redirectUri,
            state: state
        }));
})

router.get('/logged',async(req,res)=>{
    let body = {
        grant_type: "authorization_code",
        code: req.query.code,
        redirect_uri: redirectUri,
        client_id: clientId,
        client_secret:clientSecret
    }
    //fetch for access and refresh token for the user
    await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept": "application/json"
        },
        body: encodeFormData(body)
    })
        .then(resp => resp.json())
        .then(data => {
            let query = querystring.stringify(data);
            res.redirect(`https://localhost:3000/${query}`)
        });
})

router.get("/refreshToken/:refreshKey", async (req,res) => {
    let urlEncodedBody = {
        grant_type: "refresh_token",
        refresh_token: req.params.refreshKey
    }
    await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": 'Basic ' + (new Buffer(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET).toString('base64'))
        },
        body: encodeFormData(urlEncodedBody)
    })
        .then(resp => resp.json())
        .then(data => res.json(data));
})

module.exports = router;