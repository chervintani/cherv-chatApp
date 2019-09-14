const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');
var userCount = 0;
//Serve public directory
var users = [];
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, +'public/index.html'));
});

io.on('connection', function(socket) {
	console.log('a user connected');

//ADDED NICKNAME
	socket.on('send-nickname', function(nickname) {
		socket.nickname = nickname;
		users.push(socket.nickname);
		console.log(users);
	});


	users.push(socket)

	console.log(users[0].username);

	userCount++;
	io.sockets.emit('userCount', { userCount: userCount });
	socket.on('disconnect', function () {
		userCount--;
		io.sockets.emit('userCount', { userCount: userCount });

	});


	// socket.on('disconnect', () => {
	// 	console.log('user disconnected');
	// });

	socket.on('typing',function(data){
		socket.broadcast.emit('typing',{username : socket.username});
	})

	socket.on('message', message => {
		console.log('message: ' + message);
		//Broadcast the message to everyone
		io.emit('message', message);
	});
});





http.listen(3000, () => {
	console.log('listening on port 3000');
});
