'use strict';

const SockJS = require('sockjs-client'); // <1>
const Stomp  = require('stompjs'); // <2>

function register(registrations) {
    console.log('entra aca')
	const socket = SockJS(`http://localhost:8080/payroll`); // <3>
    const stompClient = Stomp.over(socket);
    var headers = {
        "Authorization": `Bearer ${localStorage.getItem('token')}`
    }
  
    stompClient.connect(headers, function(frame) {
        console.log(frame)
        registrations.forEach(function (registration) { // <4>
            stompClient.subscribe(registration.route, registration.callback);
        });
	}, function(frame) {
        console.log(frame)
    });
  
}

module.exports.register = register;
