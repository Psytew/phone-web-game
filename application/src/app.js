import React from 'react';
import io from 'socket.io-client';

export default class App extends React.Component {
    render() {
        return <div><h2>Hello Everyone! I'm inside the App File!</h2></div>;
    }
    componentDidMount(){
        var socket = io.connect('http://localhost:4000');
        console.log(socket)
    }
}