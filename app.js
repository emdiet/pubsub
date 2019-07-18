const WebSocket = require('ws');

const port = process.env.PORT || 11711;
const wss = new WebSocket.Server({ port: port });
let IDGEN = 0;
const CLEANING_INTERVAL = process.env.CLEANING_INTERVAL || 10000;
const links = {};

function getID(){
  IDGEN = (IDGEN + 1) % Number.MAX_SAFE_INTEGER;
  return IDGEN;
}

console.log("listening on port "+port);

wss.on('connection', function connection(ws, req) {
  const channel = req.url;
  onPong(ws); // resetting timeout;

  console.log("adding to channel "+ channel);

  //notify info subs
  links['/info'] && Object.values(links['/info'])
      .forEach(socket => socket.send(JSON.stringify({"nsub": ws, "channel": channel})));

  const id = getID();
  if(!links[channel]){
    links[channel] = {};
  }
  links[channel][id] = ws;

  ws.on('pong', function pong() {
    console.log("pong "+id);
    onPong(ws);
  });

  ws.on('close', function close() {
    links['/info'] && Object.values(links['/info'])
        .forEach(socket => socket.send(JSON.stringify({"closing": ws, "channel": channel})));
    console.log("closing "+id);
    delete links[channel][id];
    if(Object.keys(links[channel]).length < 1){
      delete links[channel];
    }
  });

  switch (channel) {
    case "/info": {
      ws.on('message', function incoming(message) {
        onPong(ws);
        ws.send(JSON.stringify({links: links}));
      });
    } break;
    case "/echo": {
      ws.on('message', function incoming(message) {
        onPong(ws);
        ws.send(message);
      });
    } break;
    default: {
      ws.on('message', function incoming(message) {
        onPong(ws);
        //broadcast
        Object.entries(links[channel])
            .filter(e => e[1] !== ws)
            .forEach(e => e[1].send(message));
        console.log("relaying", message);
      });
    }
  }
});

function onPong(ws){
  ws.lastPong = Date().now;
}

function clean() {
  Object.values(links).forEach(link => {
    const time = Date.now();
    Object.values(link).forEach(socket => {
      if(time - socket.lastPong > CLEANING_INTERVAL){
        console.log("purging from channel: "+ channel);
        socket.terminate()
      } else {
        socket.ping();
      }
    })
  })
}

setInterval(clean, CLEANING_INTERVAL);
