'use strict';

const bodyParser = require('body-parser');
const express = require('express');

const { mount } = require('./lib/server/rest/connectionsapi');
const WebRtcConnectionManager = require('./lib/server/connections/webrtcconnectionmanager');

const app = express();

app.use(bodyParser.json());

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

function beforeOffer(peerConnection) {
  const dataChannel = peerConnection.createDataChannel('ping-pong');

  function onMessage(msg) {
		const { data }= msg;
		console.log("onMessage",msg);
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

//COPY }

const options = { beforeOffer }
const connectionManager = WebRtcConnectionManager.create(options);
mount(app, connectionManager, `/mi-servicio`);

const server = app.listen(3000, () => {
  const address = server.address();
  console.log(`http://localhost:${address.port}\n`);

  server.once('close', () => { connectionManager.close() });
});
