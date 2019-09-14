$(document).ready(function () {

	const messageTypes = { LEFT: 'left', RIGHT: 'right', LOGIN: 'login' };

	//Chat stuff
	const chatWindow = $('#chat');
	const messagesList = $('#messagesList');
	const messageInput = $('#messageInput');
	const sendBtn = $('#sendBtn');
	const messageForm = $('#messageForm');
	//login stuff
	let username = '';
	const usernameInput = $('#usernameInput');
	const loginBtn = $('#loginBtn');
	const loginWindow = $('#login');


	const messages = []; // { author, date, content, type }

	//Connect to socket.io - automatically tries to connect on same port app was served from
	var socket = io();
	messageForm.addClass('hidden');
	socket.on('message', function (message) {
		//Update type of message based on username
		if (message.type !== messageTypes.LOGIN) {
			if (message.author === username) {
				message.type = messageTypes.RIGHT;
			} else {
				message.type = messageTypes.LEFT;
			}
		}

		messages.push(message);
		displayMessages();

		//scroll to the bottom
		chatWindow.scrollTop() = chatWindow.height();
	});

	createMessageHTML = function (message) {
		if (message.type === messageTypes.LOGIN) {
			return `
			<p class="secondary-text text-center mb-2">${
				message.author
				} joined the chat...</p>
		`;
		}

		//I STOPPED RIGHT HERE
		return `
	<div class="messages ${
			message.type === messageTypes.LEFT ? 'you' : 'me'
			}">
		<div style="flex-direction: column;
		text-overflow: ellipsis;
		white-space: initial;
		word-wrap: break-word;
		overflow: hidden; padding: 20px;">
		<p style="font-weight: bold">${
			message.type === messageTypes.LEFT ? message.author : ''
			}</p>
     		${message.content} &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<br>
			 <p style="float: right">${message.date}</p>
  		</div>
	</div>
	`;
	};

	displayMessages = function () {
		const messagesHTML = messages
			.map(message => createMessageHTML(message))
			.join('');
		messagesList.html(messagesHTML);
	};

	sendBtn.on("click", function (e) {
		e.preventDefault();
		if (!$('#messageInput').val()) {
			console.log('Invalid input');

		}

		function formatAMPM(date) {
			var hours = date.getHours();
			var minutes = date.getMinutes();
			var ampm = hours >= 12 ? 'PM' : 'AM';
			var month = date.getMonth();
			var day = date.getDate();
			var year = date.getFullYear();
			hours = hours % 12;
			hours = hours ? hours : 12; // the hour '0' should be '12'
			minutes = minutes < 10 ? '0' + minutes : minutes;
			var strTime = hours + ':' + minutes + ' ' + ampm + '  ' + month + '/' + day + '/' + year;
			return strTime;
		}

		const message = {
			author: username,
			date: formatAMPM(new Date()),
			content: messageInput.val()
		};
		sendMessage(message);
		//clear input
		messageInput.val("");
	});



	loginBtn.on("click", function (e) {
		e.preventDefault();

		// $('#user').prepend($('#users').html());

		if (!usernameInput.val()) {
			console.log('Must supply a username');
			return Swal.fire({
				type: 'error',
				title: 'Please input username!',
			})
		}




		//set the username and create logged in message
		username = usernameInput.val();
		sendMessage({ author: username, type: messageTypes.LOGIN });



		loginWindow.addClass('hidden');
		chatWindow.removeClass('hidden');
		messageForm.removeClass('hidden');



	})

	sendMessage = function (message) {
		socket.emit('message', message);
	};
	var userCount;
	socket.on('userCount', function (data) {
		console.log(data.userCount);
		userCount = data.userCount;
		$('#user').text(userCount);

	});


	$('#messageInput').bind("keypress", function(){
		// e.preventDefault();
		socket.emit('typing');
	})

	socket.on('typing', function(data){
		$('#h2').html("<p><i>"+"I amaa"+"is typing ... </i></p>");
	})
})