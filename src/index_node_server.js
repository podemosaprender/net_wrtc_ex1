'use strict';

//S: http server, signaling
const bodyParser = require('body-parser');
const express = require('express');

const { mount } = require('./lib/server/rest/connectionsapi');
const WebRtcConnectionManager = require('./lib/server/connections/webrtcconnectionmanager');
const options= {}
const connectionManager = WebRtcConnectionManager.create(options); 

const app = express();

app.use(bodyParser.json());

mount(app, connectionManager, `/mi-servicio`);

const server = app.listen(3000, () => {
  const address = server.address();
  console.log(`http://localhost:${address.port}\n`);

  server.once('close', () => { connectionManager.close() });
});
