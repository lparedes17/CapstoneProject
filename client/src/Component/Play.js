import React, {Component} from "react";
import 'bootstrap/dist/css/bootstrap.css';
import App from "../App";

class Play extends Component {
    constructor(props) {
        super(props)

    }

    getPauseback = () =>{
        fetch('https://api.spotify.com/v1/me/player/pause?device_id=' + this.props.device_id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.props.access_token}`
            },
        }).then((data)=>console.log(data));
    }



    getPlayback = () => {
        fetch('https://api.spotify.com/v1/me/player/play?device_id=' + this.props.device_id, {
            method: 'PUT',
            body: JSON.stringify({
                context_uri: this.props.context_uri,
                position_ms: this.props.position_ms,
            }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.props.access_token}`
            },
        }).then((data) => console.log(data))
    }
    render() {
        return(
            <div className="App">
                <button onClick={this.getPlayback}>
                    <span>Play</span>
                </button>
                <button onClick={this.getPauseback}>
                    <span>Pause</span>
                </button>

            </div>
        )
    }


}

export default Play;