'use strict';

const ConnectionClient = require('./lib/client');

function pongOptions() {
	//COPY examples/ping-pong/server.js {
	function beforeOffer(peerConnection) {
		const dataChannel = peerConnection.createDataChannel('ping-pong');

		function onMessage({ data }) {
			if (data === 'ping') {
				dataChannel.send('pong');
			}
		}

		dataChannel.addEventListener('message', onMessage);

		// NOTE(mroberts): This is a hack so that we can get a callback when the
		// RTCPeerConnection is closed. In the future, we can subscribe to
		// "connectionstatechange" events.
		const { close } = peerConnection;
		peerConnection.close = function() {
			dataChannel.removeEventListener('message', onMessage);
			return close.apply(this, arguments);
		};
	}

	const options = { beforeOffer }
	
	//COPY }

	return options;
}

function pingOptions() {
	//COPY examples/ping-pong/client.js {
	function beforeAnswer(peerConnection) {
		let dataChannel = null;
		let interval = null;

		function onMessage({ data }) {
			if (data === 'pong') {
				console.log('received pong');
			}
		}

		function onDataChannel({ channel }) {
			if (channel.label !== 'ping-pong') {
				return;
			}

			dataChannel = channel;
			dataChannel.addEventListener('message', onMessage);

			interval = setInterval(() => {
				console.log('sending ping');
				dataChannel.send('ping');
			}, 1000);
		}

		peerConnection.addEventListener('datachannel', onDataChannel);

		// NOTE(mroberts): This is a hack so that we can get a callback when the
		// RTCPeerConnection is closed. In the future, we can subscribe to
		// "connectionstatechange" events.
		const { close } = peerConnection;
		peerConnection.close = function() {
			if (dataChannel) {
				dataChannel.removeEventListener('message', onMessage);
			}
			if (interval) {
				clearInterval(interval);
			}
			return close.apply(this, arguments);
		};
	}

	const options= { beforeAnswer };
	//COPY }
	return options;
}

const role= process.argv[2];
console.log("RUN AS", role)
const options= role=="pong" ? pongOptions() : pingOptions();

//COPY example/browser {
const connectionClient = new ConnectionClient({host: 'http://localhost:3001/mi-servicio', prefix: ''}); //SEE: lib/client/index.js : 39
let peerConnection = null;
(async () => {
    peerConnection = await connectionClient.createConnection(options);
})()
//COPY }
