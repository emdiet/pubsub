# EZ Lightweight WS Pubsub 4 ur Cloud Foundry (Node.js container)

Websocket based pubsub

anyone can subscribe and broadcast to any "channel" simply by opening a `ws://` or `wss://` connection to it.

it's stupid easy from any app, or even chrome: `myConnection = new WebSocket("ws://localhost:11711/myChannel"); myConnection.onmessage = console.log`


## Installation

 * clone or download
 * `npm start` or `cf push`
 
## Usage

_Note: for cloud, use `wss://<your endpoint>/<channel>`. you probably don't even need a port._

1) open your chrome console
2) copy paste

```
 a = new WebSocket("ws://localhost:11711/a"); a.onmessage = console.log
 b = new WebSocket("ws://localhost:11711/a"); b.onmessage = console.log
```
a and b are now subscribed to to channel "/a". both can broadcast by
```
 a.send("whatever");
```

## Environment Variables

* `process.env.PORT`: self explanatory, Cloud Foundry will use this. fallback is 11711
* `process.env.CLEANING_INTERVAL`: "heartbeat" interval to clean dead connections.

## More Features

### Info
subscribe to `\info`
```
 l = new WebSocket("ws://localhost:11711/info"); l.onmessage = m => console.log(JSON.parse(m.data))
```
to be notified when someone joins or leaves a channel.
if you want a full excerpt of the state of the pubsub, send any message into the info channel, e.g.
```
 l.send("literally anything")
```

### Echo
subscribe to `\echo`
```
 l = new WebSocket("ws://localhost:11711/echo"); l.onmessage = m => console.log(m.data)
```
just send whatever, it will only be reflected back to you.
```
 l.send("literally anything")
```

## Security

there is none

use cloud routes to manage access so you don't get pwned.
