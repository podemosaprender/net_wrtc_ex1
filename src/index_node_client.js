'use strict';

const ConnectionClient = require('./lib/client');

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

//COPY example/browser {
const connectionClient = new ConnectionClient({host: 'http://localhost:3000/mi-servicio', prefix: ''}); //SEE: lib/client/index.js : 39
let peerConnection = null;

(async () => {
    peerConnection = await connectionClient.createConnection(options);
})()
//COPY }
