"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _socket = _interopRequireDefault(require("socket.io-client"));

var _shortid = _interopRequireDefault(require("shortid"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

//prompt format: {intro, meat}, ie:
//'One day,' + `${person1} and ${person2}` + 'did a thing'.
var prompts = [{
  intro: "One day, ",
  meat: " discovered something wild in their backyard: "
}, {
  intro: "",
  meat: " both got jobs at a conveyer belt, when suddenly "
}, {
  intro: "At Burger King, ",
  meat: " got into a lot of trouble when "
}, {
  intro: "",
  meat: " had their friendship tested when: "
}, {
  intro: "",
  meat: " got into a huge fight when watching "
}, {
  intro: "On Christmas, ",
  meat: " got each other the worst gifts: "
}, {
  intro: "",
  meat: " both get jobs working at a conveyor belt sushi restaurant, when "
}, {
  intro: "",
  meat: " get paired in home ec class and have to take care of an egg baby together, but "
}, {
  intro: "",
  meat: " go on a trip to Hawaii together, but everything goes wrong when "
}, {
  intro: "",
  meat: " decide to launch a new business together: "
}, {
  intro: "",
  meat: " absolutely refuse to talk to each other, and eventually everyone figures out it’s all because "
}, {
  intro: "When ",
  meat: " are the finalists for the “Most Cool in the School Title,” the winner clearly ends up being "
}, {
  intro: "In a surprise twist, ",
  meat: " turn out to have always secretly been "
}, {
  intro: "",
  meat: " become locked in a race to "
}, {
  intro: "",
  meat: " absolutely refuse to talk to each other, and eventually everyone figures out it’s all because "
}, {
  intro: "",
  meat: " decide to go to town hall in order to protest the new "
}];

var App =
/*#__PURE__*/
function (_React$Component) {
  _inherits(App, _React$Component);

  function App(props) {
    var _this;

    _classCallCheck(this, App);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(App).call(this, props));
    _this.generateRoomCode = _this.generateRoomCode.bind(_assertThisInitialized(_this));
    _this.startGame = _this.startGame.bind(_assertThisInitialized(_this));
    _this.firstRound = _this.firstRound.bind(_assertThisInitialized(_this));
    _this.secondRound = _this.secondRound.bind(_assertThisInitialized(_this));
    _this.moveRounds = _this.moveRounds.bind(_assertThisInitialized(_this));
    _this.resetRoom = _this.resetRoom.bind(_assertThisInitialized(_this));
    _this.setCurrentSticks = _this.setCurrentSticks.bind(_assertThisInitialized(_this));
    _this.getId = _this.getId.bind(_assertThisInitialized(_this));
    _this.state = {
      socket: _socket["default"].connect('http://10.30.11.48:4009/'),
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
    };
    return _this;
  }

  _createClass(App, [{
    key: "render",
    value: function render() {
      if (this.state.gameState == "lobby") {
        return _react["default"].createElement("div", null, _react["default"].createElement("div", {
          id: "WelcomeGroup"
        }, _react["default"].createElement("h2", {
          className: "WelcomeIntro"
        }, "Go to http://10.30.11.48:3000/"), _react["default"].createElement("h2", {
          className: "WelcomeIntro"
        }, "ENTER ROOM CODE"), _react["default"].createElement("h1", {
          className: "WelcomeCode"
        }, this.state.roomCode)), _react["default"].createElement("div", {
          id: "playerContainer"
        }, this.state.players.map(function (player) {
          return (//For each player in the state, add a card for them.
            _react["default"].createElement("div", {
              key: player.id,
              className: "playerBox"
            }, _react["default"].createElement("strong", null, player.name), _react["default"].createElement("img", {
              className: "IntroIcon",
              src: "./images/" + player.avatar
            }))
          );
        })), this.state.players.length >= 2 && _react["default"].createElement("button", {
          id: "StartButton",
          onClick: this.startGame
        }, "Begin Game"));
      } else if (this.state.gameState == "tutorial") {
        return _react["default"].createElement("div", {
          className: "midGameText"
        }, _react["default"].createElement("p", {
          className: "midGameSubtext"
        }, "You're gonna recieve some premises on your phones right now."), _react["default"].createElement("p", {
          className: "midGameSubtext"
        }, "Try to write something funny; make it seem like a sitcom episode."), _react["default"].createElement("div", {
          className: "midGameSubtext"
        }, _react["default"].createElement("button", {
          onClick: this.firstRound
        }, "Press me to skip the tutorial!")));
      } else if (this.state.gameState === "firstRound" && this.state.round1responses != this.state.players.length * 2) {
        return _react["default"].createElement("div", {
          className: "midGameText"
        }, _react["default"].createElement("p", {
          className: "midGameSubtext"
        }, "Look at your phone for your prompts!"));
      } else if (this.state.gameState === "firstRound" && this.state.round1responses === this.state.players.length * 2) {
        return _react["default"].createElement("div", {
          key: this.getId(),
          id: "player-container"
        }, _react["default"].createElement("div", {
          className: "leftResponseContainer"
        }, _react["default"].createElement("img", {
          className: "leftStick",
          src: this.state.currentSticks[0]
        }), _react["default"].createElement("p", {
          className: "leftText"
        }, this.state.round1res[this.state.roundControl[0]].name, ": ", this.state.round1res[this.state.roundControl[0]].text)), _react["default"].createElement("div", {
          className: "rightResponseContainer"
        }, _react["default"].createElement("img", {
          key: this.getId(),
          className: "rightStick",
          src: this.state.currentSticks[1]
        }), _react["default"].createElement("p", {
          className: "rightText"
        }, this.state.round1res[this.state.roundControl[1]].name, ": ", this.state.round1res[this.state.roundControl[1]].text)), _react["default"].createElement("div", {
          className: "nextRoundButtonDiv"
        }, _react["default"].createElement("button", {
          onClick: this.moveRounds
        }, "Next")));
      } else if (this.state.gameState === "secondRound" && this.state.round2responses != this.state.players.length * 2) {
        return _react["default"].createElement("div", {
          className: "midGameText"
        }, _react["default"].createElement("p", {
          className: "midGameSubtext"
        }, "Look at your phone for round 2 of the prompts!"));
      } else if (this.state.gameState === "secondRound" && this.state.round2responses === this.state.players.length * 2) {
        return _react["default"].createElement("div", {
          key: this.getId(),
          id: "player-container"
        }, _react["default"].createElement("div", {
          className: "leftResponseContainer"
        }, _react["default"].createElement("img", {
          className: "leftStick",
          src: this.state.currentSticks[0]
        }), _react["default"].createElement("p", {
          className: "leftText"
        }, this.state.round2res[this.state.roundControl[0]].name, ": ", this.state.round2res[this.state.roundControl[0]].text)), _react["default"].createElement("div", {
          className: "rightResponseContainer"
        }, _react["default"].createElement("img", {
          className: "rightStick",
          src: this.state.currentSticks[0]
        }), _react["default"].createElement("p", {
          className: "rightText"
        }, this.state.round2res[this.state.roundControl[1]].name, ": ", this.state.round2res[this.state.roundControl[1]].text)), _react["default"].createElement("div", {
          className: "nextRoundButtonDiv"
        }, _react["default"].createElement("button", {
          onClick: this.moveRounds
        }, "Next")));
      } else if (this.state.gameState === "endGame") {
        return _react["default"].createElement("div", null, _react["default"].createElement("h1", {
          className: "ScoreHeader"
        }, "Scores"), _react["default"].createElement("ol", {
          className: "ScoreBoard"
        }, this.state.players.sort(function (a, b) {
          return b.score - a.score;
        }).map(function (player) {
          return _react["default"].createElement("li", {
            className: "ScoreListing"
          }, _react["default"].createElement("img", {
            className: "ScoreboardAvatar",
            src: "./images/" + player.avatar
          }), player.name, ": ", player.score, " points");
        })), _react["default"].createElement("div", {
          className: "PlayAgainSection"
        }, _react["default"].createElement("p", {
          className: "PlayAgainText"
        }, "Play Again?"), _react["default"].createElement("div", {
          className: "ButtonContainer"
        }, _react["default"].createElement("button", {
          className: "SamePlayerButton",
          onClick: this.resetRoom
        }, "Same Players")), _react["default"].createElement("div", {
          className: "ButtonContainer"
        }, _react["default"].createElement("button", {
          className: "DifferentPlayerButton"
        }, "Different Players"))));
      }
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      //Makes a room-code
      this.generateRoomCode(); //connects to server, then makes the room
      // var socket = io.connect('http://10.30.9.175:4009/');
      // var socket = io.connect('http://localhost:4000/');

      var socket = this.state.socket; //Select a random background, set sticks

      var backgrounds = ["background-blue", "background-red", "background-orange", "background-yellow", "background-green", "background-purple", "background-pink"];
      var selectedBackground = backgrounds[Math.floor(Math.random() * 7)];
      var appBody = document.getElementsByTagName("BODY")[0];
      console.log(selectedBackground);
      appBody.setAttribute("id", selectedBackground);
      this.setCurrentSticks(); //Connect to the server

      socket.on('connect', function () {
        socket.emit('server-room', _this2.state.roomCode);
      }); //On a new user, add user to the state

      socket.on('new-user', function (data) {
        var avatarToUse = Math.floor(Math.random() * _this2.state.inactiveAvatars.length);
        console.log(avatarToUse);
        var newPlayerAvatar = _this2.state.inactiveAvatars[avatarToUse];

        var joined = _this2.state.players.concat({
          name: data.name,
          id: data.id,
          text: "",
          score: 0,
          avatar: newPlayerAvatar + ".png"
        });

        var newInactiveArr = _toConsumableArray(_this2.state.inactiveAvatars);

        newInactiveArr.splice(avatarToUse, 1);

        _this2.setState({
          players: joined,
          inactiveAvatars: newInactiveArr
        });
      }); //When a user disconnects, remove them from the state STILL HAVE TO RE-ADD IN THE APPROPRIATE AVATAR

      socket.on('disconnection', function (data) {
        if (_this2.state.gameState == "lobby") {
          var playerList = _this2.state.players.filter(function (player) {
            return player.id !== data.id;
          });

          _this2.setState({
            players: playerList
          });
        }
      });
      socket.on('updateTextApp', function (data) {
        for (var i = 0; i < _this2.state.players.length; i++) {
          if (_this2.state.players[i].id === data.id) {
            var newPlayerList = _this2.state.players;
            newPlayerList[i].text = data.text;

            _this2.setState({
              players: newPlayerList
            });
          }
        }
      });
      socket.on('get-server-id', function (givenId) {
        socket.emit('give-server-socket', socket.id, givenId);
      });
      socket.on('addRound1Res', function (phoneId, name, res, qu) {
        var newRound1res = _this2.state.round1res;

        for (var i = 0; i < newRound1res.length; i++) {
          if (newRound1res[i].name == name && newRound1res[i].q == qu) {
            newRound1res[i].text = res;
          }
        }

        _this2.setState({
          round1res: newRound1res,
          round1responses: _this2.state.round1responses + 1
        }, function () {
          console.log(_this2.state.round1res);
          console.log(_this2.state.round1responses);
        });
      });
      socket.on('addRound2Res', function (phoneId, name, res, qu) {
        console.log("I got a thing!");
        var newRound2res = _this2.state.round2res;

        for (var i = 0; i < newRound2res.length; i++) {
          if (newRound2res[i].name == name && newRound2res[i].q == qu) {
            newRound2res[i].text = res;
          }
        }

        _this2.setState({
          round2res: newRound2res,
          round2responses: _this2.state.round2responses + 1
        }, function () {
          console.log(_this2.state.round2res);
          console.log(_this2.state.round2responses);
        });
      });
    }
  }, {
    key: "generateRoomCode",
    value: function generateRoomCode() {
      //generates new room code
      var ans = Math.random().toString(36).substring(2, 5) + Math.random().toString(36).substring(2, 5);
      this.setState({
        roomCode: ans
      });
    }
  }, {
    key: "startGame",
    value: function startGame() {
      var _this3 = this;

      var socket = this.state.socket;
      this.setState({
        gameState: "tutorial"
      });
      var newStuff = [];
      var otherNewStuff = [];

      for (var i = 0; i < this.state.players.length; i++) {
        newStuff = newStuff.concat({
          name: this.state.players[i].name,
          q: "r1q1",
          text: ""
        }, {
          name: this.state.players[i].name,
          q: "r1q2",
          text: ""
        });
        otherNewStuff = otherNewStuff.concat({
          name: this.state.players[i].name,
          q: "r2q1",
          text: ""
        }, {
          name: this.state.players[i].name,
          q: "r2q2",
          text: ""
        });
      }

      function shuffle(a) {
        for (var _i = a.length - 1; _i > 0; _i--) {
          var j = Math.floor(Math.random() * (_i + 1));
          var _ref = [a[j], a[_i]];
          a[_i] = _ref[0];
          a[j] = _ref[1];
        }

        return a;
      }

      var trueShuffle = false;

      while (trueShuffle == false) {
        shuffle(newStuff);
        trueShuffle = true;

        for (var _i2 = 0; _i2 < newStuff.length; _i2 += 2) {
          if (newStuff[_i2].name == newStuff[_i2 + 1].name) trueShuffle = false;
        }
      }

      trueShuffle = false;

      while (trueShuffle == false) {
        shuffle(otherNewStuff);
        trueShuffle = true;

        for (var _i3 = 0; _i3 < otherNewStuff.length; _i3 += 2) {
          if (otherNewStuff[_i3].name == otherNewStuff[_i3 + 1].name) trueShuffle = false;
        }
      }

      this.setState({
        round1res: newStuff,
        round2res: otherNewStuff
      });
      socket.emit('idlePhone', this.state.roomCode);
      setTimeout(function () {
        if (_this3.state.gameState == "tutorial") {
          _this3.firstRound();
        }
      }, 10000);
    }
  }, {
    key: "setCurrentSticks",
    value: function setCurrentSticks() {
      var stickArr = ["Stick1", "Stick2", "Stick3", "Stick4", "Stick5"];
      var stick1 = "./images/" + stickArr[Math.floor(Math.random() * 5)] + ".png";
      var stick2 = "./images/" + stickArr[Math.floor(Math.random() * 5)] + ".png";
      this.setState({
        currentSticks: [stick1, stick2]
      });
    }
  }, {
    key: "getId",
    value: function getId() {
      var id = _shortid["default"].generate();

      console.log(id);
      return id;
    }
  }, {
    key: "firstRound",
    value: function firstRound() {
      var socket = this.state.socket;
      this.setState({
        gameState: "firstRound",
        roundControl: [0, 1]
      });
      var promptList = [].concat(prompts); //EDIT THIS LATER TO HAVE PLAYERS NOT REPEAT

      for (var i = 0; i < this.state.players.length; i++) {
        var playerNumberArr = [];

        for (var _i4 = 0; _i4 < this.state.players.length; _i4++) {
          playerNumberArr.push(_i4);
        }

        var rand = Math.floor(Math.random() * promptList.length);
        var prompt1 = promptList[rand];
        promptList.splice(rand, 1);
        rand = Math.floor(Math.random() * playerNumberArr.length);
        var player1 = this.state.players[playerNumberArr[rand]].name;
        playerNumberArr.splice(rand, 1);
        rand = Math.floor(Math.random() * playerNumberArr.length);
        var player2 = this.state.players[playerNumberArr[rand]].name;
        playerNumberArr.splice(rand, 1);
        var returnPrompt1 = prompt1.intro + player1 + " and " + player2 + prompt1.meat; //DELETE THIS LINE LATER

        playerNumberArr = [];

        for (var _i5 = 0; _i5 < this.state.players.length; _i5++) {
          playerNumberArr.push(_i5);
        } //PLEASE


        rand = Math.floor(Math.random() * promptList.length);
        var prompt2 = promptList[rand];
        promptList.splice(rand, 1);
        rand = Math.floor(Math.random() * playerNumberArr.length);
        player1 = this.state.players[playerNumberArr[rand]].name;
        playerNumberArr.splice(rand, 1);
        rand = Math.floor(Math.random() * playerNumberArr.length);
        player2 = this.state.players[playerNumberArr[rand]].name;
        playerNumberArr.splice(rand, 1);
        var returnPrompt2 = prompt2.intro + player1 + " and " + player2 + prompt2.meat;
        socket.emit('roundOneServer', this.state.players[i].id, returnPrompt1, returnPrompt2);
      }
    }
  }, {
    key: "secondRound",
    value: function secondRound() {
      var socket = this.state.socket;
      this.setState({
        gameState: "secondRound",
        roundControl: [0, 1]
      });
      var newPromptList = [].concat(prompts);
      console.log(newPromptList); //EDIT THIS LATER TO HAVE PLAYERS NOT REPEAT

      for (var i = 0; i < this.state.players.length; i++) {
        var playerNumberArr = [];

        for (var _i6 = 0; _i6 < this.state.players.length; _i6++) {
          playerNumberArr.push(_i6);
        }

        var rand = Math.floor(Math.random() * newPromptList.length);
        var prompt1 = newPromptList[rand];
        newPromptList.splice(rand, 1);
        rand = Math.floor(Math.random() * playerNumberArr.length);
        var player1 = this.state.players[playerNumberArr[rand]].name;
        playerNumberArr.splice(rand, 1);
        rand = Math.floor(Math.random() * playerNumberArr.length);
        var player2 = this.state.players[playerNumberArr[rand]].name;
        playerNumberArr.splice(rand, 1);
        var returnPrompt1 = prompt1.intro + player1 + " and " + player2 + prompt1.meat; //DELETE THIS LINE LATER

        playerNumberArr = [];

        for (var _i7 = 0; _i7 < this.state.players.length; _i7++) {
          playerNumberArr.push(_i7);
        } //PLEASE


        rand = Math.floor(Math.random() * newPromptList.length);
        var prompt2 = newPromptList[rand];
        newPromptList.splice(rand, 1);
        rand = Math.floor(Math.random() * playerNumberArr.length);
        player1 = this.state.players[playerNumberArr[rand]].name;
        playerNumberArr.splice(rand, 1);
        rand = Math.floor(Math.random() * playerNumberArr.length);
        player2 = this.state.players[playerNumberArr[rand]].name;
        playerNumberArr.splice(rand, 1);
        var returnPrompt2 = prompt2.intro + player1 + " and " + player2 + prompt2.meat;
        socket.emit('roundTwoServer', this.state.players[i].id, returnPrompt1, returnPrompt2);
      }
    }
  }, {
    key: "moveRounds",
    value: function moveRounds() {
      var rounds = this.state.roundControl;
      this.setCurrentSticks();

      if (rounds[0] + 2 < this.state.players.length * 2) {
        rounds[0] = rounds[0] + 2;
        rounds[1] = rounds[1] + 2;
        this.setState({
          roundControl: rounds
        });
      } else {
        if (this.state.gameState === "firstRound") {
          this.setState({
            roundControl: [0, 1]
          });
          this.secondRound();
        } else {
          this.setState({
            roundControl: [0, 1],
            gameState: "endGame"
          });
        }
      }
    }
  }, {
    key: "resetRoom",
    value: function resetRoom() {
      this.setState({
        gameState: "firstRound",
        round1res: [],
        round2res: [],
        round1responses: 0,
        round2responses: 0,
        roundControl: []
      });
      this.firstRound();
    }
  }]);

  return App;
}(_react["default"].Component);

exports["default"] = App;