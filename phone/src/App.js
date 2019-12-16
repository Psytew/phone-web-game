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
        roomState: "beginning",
        roundState: "",
        name: "",
        roomCode: "",
        text: "",
        inRoom: false,
        // socket: io.connect('http://10.30.9.175:4009/'),
        socket: io.connect('http://localhost:4000'),
        appSocketID: "",
        round1questions: [],
        round2questions: [],
        r1q1: "",
        r1q2: "",
        r2q1: "",
        r2q2: ""
    }
  }
  render(){
    if (!this.state.inRoom && this.state.roomState === "beginning"){
      return (
        <div className="MainWrapper">
          <form className="SubWrapper">
            <div>
              <div>
                <label className="IntroLabel">
                  Name
                </label>
              </div>
              <div>
                <input className="IntroInput" max="12" value={this.state.name} onChange={e => this.handleName(e)} type="text"></input>
              </div>
            </div>
            <div>
              <div>
                <label className="IntroLabel">
                  RoomCode
                </label>
              </div>
              <div>
                <input className="IntroInput" max="6" value={this.state.roomCode} onChange={e => this.handleRoom(e)} type="text"></input>
              </div>
            </div>
            <div className="IntroButtonWrapper">
              <button className="IntroButton" onClick={e => this.joinRoom( e )} type="submit">Play</button>
            </div>
          </form>
        </div>
      )
    } else if (this.state.inRoom && this.state.roomState === "beginning") {
      return (
        <div className="MainWrapper">
          <div className="SubWrapper">
            <p className="InformationalText">Press "Begin Game" on the computer once everyone is in.</p>
          </div>
        </div>
      )
    } else if (this.state.roomState === "idle"){
      return (
        <div className="MainWrapper">
          <div className="SubWrapper">
            <p className="InformationalText">Please look at the screen!</p>
          </div>
        </div>
      )
    } else if (this.state.roomState === "round1" && this.state.roundState === "r1q1"){
      return (
        <div className="MainWrapper">
          <div className="SubWrapper">
            <h1 className="PromptFill">Fill in the following prompt:</h1>
            <form>
              <label className="RoundPrompt"><p>{this.state.round1questions[0]}</p></label>
              <div className="RoundInputContainer">
                <input className="RoundInput" value={this.state.r1q1} onChange={e => this.handler1q1(e)} type="text"></input>
              </div>
              <div className="RoundButtonContainer">
                <button className="RoundButton" onClick={e => this.submitr1q1( e )}>Submit</button>
              </div>
            </form>
          </div>
        </div>
      )
    } else if (this.state.roomState === "round1" && this.state.roundState === "r1q2"){
      return (
        <div className="MainWrapper">
          <div className="SubWrapper">
            <h1 className="PromptFill">Fill in the following prompt:</h1>
            <form>
              <label className="RoundPrompt"><p>{this.state.round1questions[1]}</p></label>
              <div className="RoundInputContainer">
                <input className="RoundInput" value={this.state.r1q2} onChange={e => this.handler1q2(e)} type="text"></input>
              </div>
              <div className="RoundButtonContainer">
                <button className="RoundButton" onClick={e => this.submitr1q2( e )}>Submit</button>
              </div>
            </form>
          </div>
        </div>
      )
    } else if (this.state.roomState === "round1" && this.state.roundState === "r1done"){
      return (
        <div className="MainWrapper">
          <div className="SubWrapper">
            <p className="InformationalText">Now you just have to wait for everyone else to answer their questions.</p>
          </div>
        </div>
      )
    } else if (this.state.roomState === "round2" && this.state.roundState === "r2q1"){
      return (
        <div className="MainWrapper">
          <div className="SubWrapper">
            <h1 className="PromptFill">Fill in the following prompt:</h1>
            <form>
              <label className="RoundPrompt"><p>{this.state.round2questions[0]}</p></label>
              <div className="RoundInputContainer">
                <input className="RoundInput" value={this.state.r2q1} onChange={e => this.handler2q1(e)} type="text"></input>
              </div>
              <div className="RoundButtonContainer">
                <button className="RoundButton" onClick={e => this.submitr2q1( e )}>Submit</button>
              </div>
            </form>
          </div>
        </div>
      )
    } else if (this.state.roomState === "round2" && this.state.roundState === "r2q2"){
      return (
        <div className="MainWrapper">
          <div className="SubWrapper">
            <h1 className="PromptFill">Fill in the following prompt:</h1>
            <form>
              <label className="RoundPrompt"><p>{this.state.round2questions[1]}</p></label>
              <div className="RoundInputContainer">
                <input className="RoundInput" value={this.state.r2q2} onChange={e => this.handler2q2(e)} type="text"></input>
              </div>
              <div className="RoundButtonContainer">
                <button className="RoundButton" onClick={e => this.submitr2q2( e )}>Submit</button>
              </div>
            </form>
          </div>
        </div>
      )
    } else if (this.state.roomState === "round2" && this.state.roundState === "r2done"){
      return (
        <div className="MainWrapper">
          <div className="SubWrapper">
            <p className="InformationalText">Now you just have to wait for everyone else to answer their questions.</p>
          </div>
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
      //If the room is ful
      socket.on('fullRoom', () => {
        alert("Sorry, that room is full!")
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

      //Sets the phones to idle state
      socket.on('setIdleState', () =>{
        this.setState({
          roomState: "idle"
        })
      })

      socket.on('roundOneClient', (mess1, mess2) => {
        this.setState({
          roomState: "round1",
          round1questions: [mess1, mess2],
          roundState: "r1q1"
        })
      })

      socket.on('roundTwoClient', (mess1, mess2) => {
        this.setState({
          roomState: "round2",
          round2questions: [mess1, mess2],
          roundState: "r2q1"
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
  handler1q1(e) {
    let value = e.target.value;
    this.setState({r1q1: value})
  }
  handler1q2(e) {
    let value = e.target.value;
    this.setState({r1q2: value})
  }
  handler2q1(e) {
    let value = e.target.value;
    this.setState({r2q1: value})
  }
  handler2q2(e) {
    let value = e.target.value;
    this.setState({r2q2: value})
  }
  submitr1q1(e) {
    e.preventDefault();
    const socket = this.state.socket
    this.setState({roundState: "r1q2"})
    socket.emit('submitResponse1', this.state.appSocketID, this.state.socket.id, this.state.name, (this.state.round1questions[0] + this.state.r1q1), "r1q1")
  }
  submitr1q2(e) {
    e.preventDefault();
    const socket = this.state.socket
    this.setState({roundState: "r1done"})
    socket.emit('submitResponse1', this.state.appSocketID, this.state.socket.id, this.state.name, (this.state.round1questions[1] + this.state.r1q2), "r1q2")
  }
  submitr2q1(e) {
    e.preventDefault();
    const socket = this.state.socket
    this.setState({roundState: "r2q2"})
    socket.emit('submitResponse2', this.state.appSocketID, this.state.socket.id, this.state.name, (this.state.round1questions[0] + this.state.r2q1), "r2q1")
  }
  submitr2q2(e) {
    e.preventDefault();
    const socket = this.state.socket
    this.setState({roundState: "r2done"})
    socket.emit('submitResponse2', this.state.appSocketID, this.state.socket.id, this.state.name, (this.state.round1questions[1] + this.state.r2q2), "r2q2")
  }
}

export default App;