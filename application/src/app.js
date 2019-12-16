import React from 'react';
import io from 'socket.io-client';
import shortid from "shortid";

//prompt format: {intro, meat}, ie:
//'One day,' + `${person1} and ${person2}` + 'did a thing'.
const prompts = [
    {intro: "One day, ", meat: " discovered something wild in their backyard: "},
    {intro: "", meat: " both got jobs at a conveyer belt, when suddenly "},
    {intro: "At Burger King, ", meat: " got into a lot of trouble when "},
    {intro: "", meat: " had their friendship tested when: "},
    {intro: "", meat: " got into a huge fight when watching "},
    {intro: "On Christmas, ", meat: " got each other the worst gifts: "},
    {intro: "", meat: " both get jobs working at a conveyor belt sushi restaurant, when "},
    {intro: "", meat: " get paired in home ec class and have to take care of an egg baby together, but "},
    {intro: "", meat: " go on a trip to Hawaii together, but everything goes wrong when "},
    {intro: "", meat: " decide to launch a new business together: "},
    {intro: "", meat: " absolutely refuse to talk to each other, and eventually everyone figures out it’s all because "},
    {intro: "When ", meat: " are the finalists for the “Most Cool in the School Title,” the winner clearly ends up being "},
    {intro: "In a surprise twist, ", meat: " turn out to have always secretly been "},
    {intro: "", meat: " become locked in a race to "},
    {intro: "", meat: " absolutely refuse to talk to each other, and eventually everyone figures out it’s all because "},
    {intro: "", meat: " decide to go to town hall in order to protest the new "}
]

export default class App extends React.Component {
    constructor(props) {
        super(props)
        this.generateRoomCode = this.generateRoomCode.bind(this);
        this.startGame = this.startGame.bind(this);
        this.firstRound = this.firstRound.bind(this);
        this.secondRound = this.secondRound.bind(this);
        this.moveRounds = this.moveRounds.bind(this);
        this.resetRoom = this.resetRoom.bind(this);
        this.setCurrentSticks = this.setCurrentSticks.bind(this);
        this.getId = this.getId.bind(this)
        this.state = {
            socket: io.connect('http://10.30.11.48:4009/'),
            roomCode: "",
            players: [],
            gameState: "lobby",
            round1res: [],
            round2res: [],
            round1responses: 0,
            round2responses: 0,
            roundControl: [],
            inactiveAvatars: ["Clown", "Devil", "Fez", "Gamer", "Jason", "Moustache", "Pirate", "Weirdo"],
            activeAvatars: [],
            currentSticks: []
        }
    }
    render() {
        if (this.state.gameState == "lobby"){
            return(
                <div>
                    <div id="WelcomeGroup">
                        <h2 className="WelcomeIntro">Go to http://10.30.11.48:3000/</h2>
                        <h2 className="WelcomeIntro">ENTER ROOM CODE</h2>
                        <h1 className="WelcomeCode">{this.state.roomCode}</h1>
                    </div>
                    <div id="playerContainer">
                        {this.state.players.map((player) => (
                            //For each player in the state, add a card for them.
                            <div key={player.id} className="playerBox">
                                <strong>{player.name}</strong>
                                <img className="IntroIcon" src={"./images/" + player.avatar}></img>
                            </div>
                        ))}
                    </div>
                    {/*FIX THIS LATER!!!!!!!!!!!!!!!!!!!1!1*/}
                    {this.state.players.length >= 2 && 
                        <button id="StartButton" onClick={this.startGame}>Begin Game</button>
                    }
                </div>
            );
        }
        else if (this.state.gameState == "tutorial"){
            return(
                <div className="midGameText">
                    <p className="midGameSubtext">You're gonna recieve some premises on your phones right now.</p>
                    <p className="midGameSubtext">Try to write something funny; make it seem like a sitcom episode.</p>
                    <div className="midGameSubtext">
                        <button onClick={this.firstRound}>Press me to skip the tutorial!</button>
                    </div>
                </div>
            );
        }
        else if (this.state.gameState === "firstRound" && this.state.round1responses != (this.state.players.length * 2)){
            return(
                <div className="midGameText">
                    <p className="midGameSubtext">Look at your phone for your prompts!</p>
                </div>
            )
        } else if (this.state.gameState === "firstRound" && this.state.round1responses === (this.state.players.length * 2)){
            return(
                <div key={this.getId()} id="player-container">
                    <div className="leftResponseContainer">
                        <img className="leftStick" src={this.state.currentSticks[0]}></img>
                        <p className="leftText">{this.state.round1res[this.state.roundControl[0]].name}: {this.state.round1res[this.state.roundControl[0]].text}</p>
                    </div>
                    <div className="rightResponseContainer">
                        <img key={this.getId()} className="rightStick" src={this.state.currentSticks[1]}></img>
                        <p className="rightText">{this.state.round1res[this.state.roundControl[1]].name}: {this.state.round1res[this.state.roundControl[1]].text}</p>
                    </div>
                    <div className="nextRoundButtonDiv">
                        <button onClick={this.moveRounds}>Next</button>
                    </div>
                </div>
            )
        } else if (this.state.gameState === "secondRound" && this.state.round2responses != (this.state.players.length * 2)){
            return(
                <div className="midGameText">
                    <p className="midGameSubtext">Look at your phone for round 2 of the prompts!</p>
                </div>
            )
        } else if (this.state.gameState === "secondRound" && this.state.round2responses === (this.state.players.length * 2)){
            return(
                <div key={this.getId()} id="player-container">
                    <div className="leftResponseContainer">
                        <img className="leftStick" src={this.state.currentSticks[0]}></img>
                        <p className="leftText">{this.state.round2res[this.state.roundControl[0]].name}: {this.state.round2res[this.state.roundControl[0]].text}</p>
                    </div>
                    <div className="rightResponseContainer">
                        <img className="rightStick" src={this.state.currentSticks[0]}></img>
                        <p className="rightText">{this.state.round2res[this.state.roundControl[1]].name}: {this.state.round2res[this.state.roundControl[1]].text}</p>
                    </div>
                    <div className="nextRoundButtonDiv">
                        <button onClick={this.moveRounds}>Next</button>
                    </div>
                </div>
            )
        } else if (this.state.gameState === "endGame"){
            return (
                <div>
                    <h1 className="ScoreHeader">Scores</h1>
                    <ol className="ScoreBoard">
                        {this.state.players.sort(function(a, b){return b.score-a.score}).map((player) => (
                            <li className="ScoreListing"><img className="ScoreboardAvatar" src={"./images/" + player.avatar}></img>{player.name}: {player.score} points</li>
                        ))}
                    </ol>
                    <div className="PlayAgainSection">
                        <p className="PlayAgainText">Play Again?</p>
                        <div className="ButtonContainer">
                            <button className="SamePlayerButton" onClick={this.resetRoom}>Same Players</button>
                        </div>
                        <div className="ButtonContainer">
                            <button className="DifferentPlayerButton">Different Players</button>
                        </div>
                    </div>
                </div>
            )
        }
    }

    componentDidMount(){
        //Makes a room-code
        this.generateRoomCode()
        //connects to server, then makes the room
        // var socket = io.connect('http://10.30.9.175:4009/');
        // var socket = io.connect('http://localhost:4000/');
        const socket = this.state.socket

        //Select a random background, set sticks
        let backgrounds = ["background-blue", "background-red", "background-orange", "background-yellow", "background-green", "background-purple", "background-pink"]
        let selectedBackground = backgrounds[Math.floor(Math.random() * 7)]
        let appBody = document.getElementsByTagName("BODY")[0];
        console.log(selectedBackground)
        appBody.setAttribute("id", selectedBackground);
        this.setCurrentSticks();

        //Connect to the server
        socket.on('connect', () => {
            socket.emit('server-room', this.state.roomCode);
        });

        //On a new user, add user to the state
        socket.on('new-user', (data) => {
            let avatarToUse = Math.floor(Math.random() * this.state.inactiveAvatars.length)
            console.log(avatarToUse)
            let newPlayerAvatar = this.state.inactiveAvatars[avatarToUse]
            var joined = this.state.players.concat({name: data.name, id: data.id, text: "", score: 0, avatar: newPlayerAvatar + ".png"});
            let newInactiveArr = [...this.state.inactiveAvatars]
            newInactiveArr.splice(avatarToUse, 1)
            this.setState({
                players: joined,
                inactiveAvatars: newInactiveArr
            })
        })

        //When a user disconnects, remove them from the state STILL HAVE TO RE-ADD IN THE APPROPRIATE AVATAR
        socket.on('disconnection', (data) => {
            if (this.state.gameState == "lobby"){
                let playerList = this.state.players.filter(player => player.id !== data.id)
                this.setState({
                    players: playerList
                })
            }
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

        socket.on('addRound1Res', (phoneId, name, res, qu) => {
            let newRound1res = this.state.round1res
            for (let i = 0; i < newRound1res.length; i++){
                if (newRound1res[i].name == name && newRound1res[i].q == qu){
                    newRound1res[i].text = res
                }
            }
            this.setState({
                round1res: newRound1res,
                round1responses: this.state.round1responses + 1
            }, () => {
                console.log(this.state.round1res)
                console.log(this.state.round1responses)
            })
        })

        socket.on('addRound2Res', (phoneId, name, res, qu) => {
            console.log("I got a thing!")
            let newRound2res = this.state.round2res
            for (let i = 0; i < newRound2res.length; i++){
                if (newRound2res[i].name == name && newRound2res[i].q == qu){
                    newRound2res[i].text = res
                }
            }
            this.setState({
                round2res: newRound2res,
                round2responses: this.state.round2responses + 1
            }, () => {
                console.log(this.state.round2res)
                console.log(this.state.round2responses)
            })
        })

    }
    generateRoomCode(){
        //generates new room code
        let ans = Math.random().toString(36).substring(2, 5) + Math.random().toString(36).substring(2, 5);
        this.setState({
            roomCode: ans
        })
    }
    startGame(){
        const socket = this.state.socket

        this.setState({
            gameState: "tutorial"
        })

        let newStuff = []
        let otherNewStuff = []
        for (let i = 0; i < this.state.players.length; i++){
            newStuff = newStuff.concat({name: this.state.players[i].name, q: "r1q1", text: ""},{name: this.state.players[i].name, q: "r1q2", text: ""})
            otherNewStuff = otherNewStuff.concat({name: this.state.players[i].name, q: "r2q1", text: ""},{name: this.state.players[i].name, q: "r2q2", text: ""})
        }

        function shuffle(a) {
            for (let i = a.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [a[i], a[j]] = [a[j], a[i]];
            }
            return a;
        }

        let trueShuffle = false

        while (trueShuffle == false){
            shuffle(newStuff)
            trueShuffle = true
            for (let i = 0; i < newStuff.length; i += 2){
                if (newStuff[i].name == newStuff[i + 1].name)
                trueShuffle = false
            }
        }

        trueShuffle = false

        while (trueShuffle == false){
            shuffle(otherNewStuff)
            trueShuffle = true
            for (let i = 0; i < otherNewStuff.length; i += 2){
                if (otherNewStuff[i].name == otherNewStuff[i + 1].name)
                trueShuffle = false
            }
        }

        this.setState({
            round1res: newStuff,
            round2res: otherNewStuff
        })

        socket.emit('idlePhone', this.state.roomCode)

        setTimeout(() => {
            if (this.state.gameState == "tutorial"){
                this.firstRound();
            }
        }, 10000)
    }
    setCurrentSticks(){
        let stickArr = ["Stick1", "Stick2", "Stick3", "Stick4", "Stick5"]
        let stick1 = "./images/" + stickArr[Math.floor(Math.random() * 5)] + ".png"
        let stick2 = "./images/" + stickArr[Math.floor(Math.random() * 5)] + ".png"
        
        this.setState({
            currentSticks: [stick1, stick2]
        })
    }
    getId(){
        const id = shortid.generate();
        console.log(id);
        return id;
    };
    firstRound(){
        const socket = this.state.socket

        this.setState({
            gameState: "firstRound",
            roundControl: [0,1]
        })

        let promptList = [...prompts];

        //EDIT THIS LATER TO HAVE PLAYERS NOT REPEAT

        for (let i = 0; i < this.state.players.length; i++){
            let playerNumberArr = [];
            for (let i = 0; i < this.state.players.length; i++) {
                playerNumberArr.push(i);
            }
            let rand = Math.floor(Math.random() * promptList.length)
            let prompt1 = promptList[rand]
            promptList.splice(rand,1)
            rand = Math.floor(Math.random() * playerNumberArr.length)
            let player1 = this.state.players[playerNumberArr[rand]].name
            playerNumberArr.splice(rand,1)
            rand = Math.floor(Math.random() * playerNumberArr.length)
            let player2 = this.state.players[playerNumberArr[rand]].name
            playerNumberArr.splice(rand,1)
            let returnPrompt1 = prompt1.intro + player1 + " and " + player2 + prompt1.meat
            //DELETE THIS LINE LATER
            playerNumberArr = [];
            for (let i = 0; i < this.state.players.length; i++) {
                playerNumberArr.push(i);
            }
            //PLEASE
            rand = Math.floor(Math.random() * promptList.length)
            let prompt2 = promptList[rand]
            promptList.splice(rand,1)
            rand = Math.floor(Math.random() * playerNumberArr.length)
            player1 = this.state.players[playerNumberArr[rand]].name
            playerNumberArr.splice(rand,1)
            rand = Math.floor(Math.random() * playerNumberArr.length)
            player2 = this.state.players[playerNumberArr[rand]].name
            playerNumberArr.splice(rand,1)
            let returnPrompt2 = prompt2.intro + player1 + " and " + player2 + prompt2.meat
            socket.emit('roundOneServer', this.state.players[i].id, returnPrompt1, returnPrompt2)
        }
    }
    secondRound(){
        const socket = this.state.socket
        this.setState({
            gameState: "secondRound",
            roundControl: [0,1]
        })
        let newPromptList = [...prompts];
        console.log(newPromptList)
        //EDIT THIS LATER TO HAVE PLAYERS NOT REPEAT
        for (let i = 0; i < this.state.players.length; i++){
            let playerNumberArr = [];
            for (let i = 0; i < this.state.players.length; i++) {
                playerNumberArr.push(i);
            }
            let rand = Math.floor(Math.random() * newPromptList.length)
            let prompt1 = newPromptList[rand]
            newPromptList.splice(rand,1)
            rand = Math.floor(Math.random() * playerNumberArr.length)
            let player1 = this.state.players[playerNumberArr[rand]].name
            playerNumberArr.splice(rand,1)
            rand = Math.floor(Math.random() * playerNumberArr.length)
            let player2 = this.state.players[playerNumberArr[rand]].name
            playerNumberArr.splice(rand,1)
            let returnPrompt1 = prompt1.intro + player1 + " and " + player2 + prompt1.meat
            //DELETE THIS LINE LATER
            playerNumberArr = [];
            for (let i = 0; i < this.state.players.length; i++) {
                playerNumberArr.push(i);
            }
            //PLEASE
            rand = Math.floor(Math.random() * newPromptList.length)
            let prompt2 = newPromptList[rand]
            newPromptList.splice(rand,1)
            rand = Math.floor(Math.random() * playerNumberArr.length)
            player1 = this.state.players[playerNumberArr[rand]].name
            playerNumberArr.splice(rand,1)
            rand = Math.floor(Math.random() * playerNumberArr.length)
            player2 = this.state.players[playerNumberArr[rand]].name
            playerNumberArr.splice(rand,1)
            let returnPrompt2 = prompt2.intro + player1 + " and " + player2 + prompt2.meat
            socket.emit('roundTwoServer', this.state.players[i].id, returnPrompt1, returnPrompt2)
        }
    }
    moveRounds(){
        let rounds = this.state.roundControl
        this.setCurrentSticks()
        if (rounds[0] + 2 < (this.state.players.length * 2)) {
            rounds[0] = rounds[0] + 2
            rounds[1] = rounds[1] + 2
            this.setState({
                roundControl: rounds
            })
        } else {
            if (this.state.gameState === "firstRound"){
                this.setState({
                    roundControl: [0, 1]
                })
                this.secondRound()
            } else {
                this.setState({
                    roundControl: [0, 1],
                    gameState: "endGame"
                })
            }
        }
    }
    resetRoom(){
        this.setState({
            gameState: "firstRound",
            round1res: [],
            round2res: [],
            round1responses: 0,
            round2responses: 0,
            roundControl: []
        })

        this.firstRound()
    }
}