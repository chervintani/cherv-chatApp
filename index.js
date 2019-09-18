const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');
const port = 8080;
//Serve public directory
var users = [];

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname, +'public/index.html'));
});

io.on('connection', function (socket) {
	console.log('a user connected');

	//ADDED NICKNAME
	socket.on('send-nickname', function (data) {
		socket.nickname = data;
		if (users.indexOf(data) > -1) {
			socket.emit('userExists', data + ' username is taken! Try some other username.');
		} else {
			users.push(socket.nickname);
			io.sockets.emit('allUsers', users);
		}
	});
	//DISCONNECTION
	socket.on('disconnect', function () {
		var index = users.indexOf(socket.nickname);
		if (index > -1) {
			users.splice(index, 1);
		}
		io.sockets.emit('allUsers', users);
		//THIS IS NOT DONE //////////////////////////////////////////////////
		io.sockets.emit('allUsersDis', users);
	});
	//TYPING
	socket.on('typing', function (data) {
		socket.broadcast.emit('typing', { username: socket.nickname });
	})
	//MESSAGE SENDING
	socket.on('message', function (message) {
		console.log('message: ' + message);
		io.emit('message', message);
	});
});

http.listen(port, function () {
	console.log('listening on port ' + port);
});
