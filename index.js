const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');
var userCount = 0;
//Serve public directory
var users = [];

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname, +'public/index.html'));
});

io.on('connection', function(socket) {
	console.log('a user connected');

//ADDED NICKNAME
	socket.on('send-nickname', function(data) {
		socket.nickname = data;
		if (users.indexOf(data) > -1) {
			socket.emit('userExists', data + ' username is taken! Try some other username.');
		  } else {
			users.push(data);
			socket.emit('userSet', { username: data });
		  }
	});

	
	console.log(users[0]);

	userCount++;
	io.sockets.emit('userCount', { userCount: userCount });
	socket.on('disconnect', function () {
		userCount--;
		io.sockets.emit('userCount', { userCount: userCount });
	});


	socket.on('typing',function(data){
		socket.broadcast.emit('typing',{username : socket.nickname});
	})

	socket.on('message', function(message){
		console.log('message: ' + message);
		io.emit('message', message);
	});
});





http.listen(3000, function(){
	console.log('listening on port 3000');
});
