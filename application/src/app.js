import React from 'react';
import io from 'socket.io-client';
import Card from 'react-bootstrap/Card';

export default class App extends React.Component {
    constructor(props) {
        super(props)
        this.generateRoomCode = this.generateRoomCode.bind(this);
        this.state = {
            roomCode: "",
            players: []
        }
    }
    render() {
        return(
            <div>
                <h2>Welcome to the game! RoomCode: {this.state.roomCode}</h2>
                <div id="player-container">
                    {this.state.players.map((player) => (
                        //For each player in the state, add a card for them.
                        <Card key={player.id} style={{ width: '33%' }}>
                            <Card.Body>
                                <Card.Title className="card-text"><strong>{player.name}</strong></Card.Title>
                                <Card.Text className="card-text">
                                    {player.text}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }
    componentDidMount(){
        //Makes a room-code
        this.generateRoomCode()
        //connects to server, then makes the room
        var socket = io.connect('http://localhost:4000');
        socket.on('connect', () => {
            socket.emit('server-room', this.state.roomCode);
        });

        //On a new user, add user to the state
        socket.on('new-user', (data) => {
            var joined = this.state.players.concat({name: data.name, id: data.id, text: "f"});
            this.setState({
                players: joined
            })
        })

        //When a user disconnects, remove them from the state
        socket.on('disconnection', (data) => {
            let playerList = this.state.players.filter(player => player.id !== data.id)
            this.setState({
                players: playerList
            })
        })

        socket.on('updateTextApp', (data) => {
            for (let i = 0; i < this.state.players.length; i++){
                if (this.state.players[i].id === data.id){
                    let newPlayerList = this.state.players
                    newPlayerList[i].text = data.text
                    this.setState({
                        players: newPlayerList
                    })
                }
            }
        })

        socket.on('get-server-id', (givenId) => {
            socket.emit('give-server-socket', socket.id, givenId)
        })
    }
    generateRoomCode(){
        //generates new room code
        let ans = Math.random().toString(36).substring(2, 5) + Math.random().toString(36).substring(2, 5);
        this.setState({
            roomCode: ans
        })
    }
}