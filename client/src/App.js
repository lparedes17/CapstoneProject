import React, {Component} from 'react';
import './App.css';
import {

    BrowserRouter as Router,
    Switch,
    Route, Link,Redirect
} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './Component/Login';
import Home from './Component/Home';
import logo from "./logo.svg";

class App extends Component {
    constructor() {
        super();
        this.state={
            display:'block'
        }

    }

    onChange = () =>{
        this.setState({
            display:'none'
        })
    }



    render() {
        return (
            <div style={{color:"white",backgroundColor: "#282c34",minHeight: "100vh"}}>
                <Router>
                    <Switch>
                        <Route path={"/login"} component={Login}/>
                        <Route path={"/home"} component={Home}/>
                    </Switch>
                    <h1 style={{display:this.state.display}}>Welcome to my demo!</h1>
                    <Link to={"/login"}>
                        <button style={{width:"100%",backgroundColor:"green",display:this.state.display}} onClick={this.onChange}>
                            <span>
                            Click in to sync with Spotify
                            </span>
                        </button>
                    </Link>
                </Router>
            </div>

        );

    }

}

export default App;