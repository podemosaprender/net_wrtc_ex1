# net_wrtc_ex1

Connect P2P node to node or node to browser to send data via WebRTC (works behind firewalls)

FROM: https://github.com/node-webrtc/node-webrtc

Simplified, remove any code not required for our application.

Next steps:

1. Separate peer1, peer2, signaling server
    * signaling handled through ./src/lib/server/rest/connectionsapi.js calling `ConnectionManager`

2. Tunnel TCP connection, e.g. ssh
    SEE: https://gist.github.com/khalil19/0d69f6ed4213d6c6719c5e3db535b2d6#file-tcp_client-js https://gist.github.com/khalil19/ea89bfebcfb666839d7797dcc43f98cf#file-tcp_server-js

We may also add WebRTC support to Python https://pypi.org/project/pproxy/

wRTC is used by WebTorrent https://github.com/webtorrent/webtorrent-hybrid/blob/98c8d76f8c70f681ddf36ae8a52722c4200884da/package.json#L19

ANOTHER OPTION was https://www.npmjs.com/package/peerjs-on-node BUT peerjs signaling has too many requirements compared to this just post/get: ./src/lib/server/rest/connectionsapi.js

Check https://en.wikipedia.org/wiki/QUIC availability! (+ hamachi)
* https://www.fastvue.co/fastvue/blog/googles-quic-protocols-security-and-reporting-implications/



