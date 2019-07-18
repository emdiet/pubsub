test with

ws = new WebSocket("ws://connect-user-link.eu-gb.mybluemix.net/sasd"); ws.onmessage = console.log; ws1 = new WebSocket("ws://connect-user-link.eu-gb.mybluemix.net/sasd"); ws1.onmessage = console.log;
wsi =  new WebSocket("ws://connect-user-link.eu-gb.mybluemix.net/info");


ws3 = new WebSocket("ws://connect-user-link.eu-gb.mybluemix.net/sasd"); ws3.onmessage = m => console.log("ws3: "+m.data)

or localhost:11711

process.env.CF_INSTANCE_INDEX
