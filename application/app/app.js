"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _socket = _interopRequireDefault(require("socket.io-client"));

var _Card = _interopRequireDefault(require("react-bootstrap/Card"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var App =
/*#__PURE__*/
function (_React$Component) {
  _inherits(App, _React$Component);

  function App(props) {
    var _this;

    _classCallCheck(this, App);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(App).call(this, props));
    _this.generateRoomCode = _this.generateRoomCode.bind(_assertThisInitialized(_this));
    _this.state = {
      roomCode: "",
      players: []
    };
    return _this;
  }

  _createClass(App, [{
    key: "render",
    value: function render() {
      return _react["default"].createElement("div", null, _react["default"].createElement("h2", null, "Welcome to the game! RoomCode: ", this.state.roomCode), _react["default"].createElement("div", {
        id: "player-container"
      }, this.state.players.map(function (player) {
        return (//For each player in the state, add a card for them.
          _react["default"].createElement(_Card["default"], {
            key: player.id,
            style: {
              width: '33%'
            }
          }, _react["default"].createElement(_Card["default"].Body, null, _react["default"].createElement(_Card["default"].Title, {
            className: "card-text"
          }, _react["default"].createElement("strong", null, player.name)), _react["default"].createElement(_Card["default"].Text, {
            className: "card-text"
          }, player.text)))
        );
      })));
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      //Makes a room-code
      this.generateRoomCode(); //connects to server, then makes the room

      var socket = _socket["default"].connect('http://localhost:4000');

      socket.on('connect', function () {
        socket.emit('server-room', _this2.state.roomCode);
      }); //On a new user, add user to the state

      socket.on('new-user', function (data) {
        var joined = _this2.state.players.concat({
          name: data.name,
          id: data.id,
          text: "f"
        });

        _this2.setState({
          players: joined
        });
      }); //When a user disconnects, remove them from the state

      socket.on('disconnection', function (data) {
        var playerList = _this2.state.players.filter(function (player) {
          return player.id !== data.id;
        });

        _this2.setState({
          players: playerList
        });
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
  }]);

  return App;
}(_react["default"].Component);

exports["default"] = App;