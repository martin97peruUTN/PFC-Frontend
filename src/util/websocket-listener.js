'use strict';

const SockJS = require('sockjs-client'); // <1>
const Stomp  = require('stompjs'); // <2>

function register(registrations) {
    console.log('entra aca')
	// const socket = SockJS(`http://localhost:8080/payroll?token=${localStorage.getItem('token')}`); // <3>
    const socket = SockJS(`http://localhost:8080/payroll`); // <3>
    // const socket = new WebSocket(`wss://localhost:8080/payroll`)
	const stompClient = Stomp.over(socket);
    var headers = {
        Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  
    stompClient.connect({"X-Authorization": "Bearer " + localStorage.getItem('token')}, function(frame) {
        console.log(frame)
        registrations.forEach(function (registration) { // <4>
            stompClient.subscribe(registration.route, registration.callback);
        });
	}, function(frame) {
        console.log(frame)
    });
  
}

module.exports.register = register;
