import React from 'react';
import logo from './logo.svg';
import './App.css';
import io from 'socket.io-client';

class App extends React.Component {
  constructor(props) {
    super(props)
    this.joinRoom = this.joinRoom.bind(this);
    this.handleName = this.handleName.bind(this)
    this.handleRoom = this.handleRoom.bind(this)
    this.handleText = this.handleText.bind(this)
    this.state = {
        name: "",
        roomCode: "",
        text: "",
        inRoom: false,
        socket: io.connect('http://localhost:4000'),
        appSocketID: ""
    }
  }
  render(){
    if (!this.state.inRoom){
      return (
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <form>
              <div>
                <label>
                  Name
                </label>
                <input max="12" value={this.state.name} onChange={e => this.handleName(e)} type="text"></input>
              </div>
              <div>
                <label>
                  RoomCode
                </label>
                <input max="6" value={this.state.roomCode} onChange={e => this.handleRoom(e)} type="text"></input>
              </div>
              <button onClick={e => this.joinRoom( e )} type="submit">Submit</button>
            </form>
          </header>
        </div>
      )
    } else {
      return (
        <div>
          <p>You are now in room {this.state.roomCode}, {this.state.name}.</p>
          <form>
            <label>
              What would you like to say?
            </label>
            <input max="100" value={this.state.text} onChange={e => this.handleText(e)} type="text"></input>
            <button onClick={e => this.submitText( e )} type="submit">Submit</button>
          </form>
        </div>
      )
    }
  }
  joinRoom(e){
    e.preventDefault()
    //Access the socket in the state
    const socket = this.state.socket
    if (this.state.name.length > 0 && this.state.roomCode.length === 6){
      //If there's a name and a valid room code, try to join the room
      socket.emit('client-room', this.state.roomCode, this.state.name)
      //If the room code isn't correct, send an alert
      socket.on('falseCode', function(){
        alert("Please make sure you have a valid roomcode.")
      })
      //If the room code is correct, set the state to be in the room
      socket.on('inRoom', () => {
        this.setState({inRoom:true})
        console.log("I did a thing!")
        socket.emit('search-for-app-id', this.state.roomCode)
        console.log("I did a thing! 2")
      })
      //Set the state of the server client to communicate to
      socket.on('give-server-info', (serverId) => {
        console.log("The server id is " + serverId)
        this.setState({
          appSocketID: serverId
        })
      })
      //If there's no name, prompt for one
    } else if (this.state.name.length === 0){
      alert("Please input a name!")
      //If the room code isn't 6 chars, prompt for that
    } else {
      alert("Please make sure you have a valid roomcode.")
    }
  }
  submitText(e){
    e.preventDefault()
    const socket = this.state.socket
    socket.emit('updateText', this.state.appSocketID, this.state.text, this.state.socket.id)
    this.setState({text: ""});
  }
  handleName(event) {
    //Make sure the name updates and is only twelve characters or less
    let { value, max } = event.target;
    value = value.substr(0,max)
    this.setState({name: value});
  }
  handleRoom(event) {
    //Make sure the room code updates and is only six characters or less
    let { value, max } = event.target;
    value = value.substr(0,max)
    this.setState({roomCode: value});
  }
  handleText(event) {
    //Make sure the room code updates and is only six characters or less
    let { value, max } = event.target;
    value = value.substr(0,max)
    this.setState({text: value});
  }
}

export default App;