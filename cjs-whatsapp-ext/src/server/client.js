const WebSocket = require('ws');

const getTime = () => new Date().toISOString().split("T")[1].split(".")[0];

const url = `ws://localhost:55300`;
const client = new WebSocket(url);

client.onopen = function() {
    console.log('connected!');
    client.send(`${getTime()} - Thanks for connecting client...`);
}

client.onmessage = function (msg) {
    console.log(msg.data);
    setTimeout(() => {
        client.send(`${getTime()} - Thanks for connecting client...`);
    }, 2 * 1000)
}

client.onerror = () =>{
    console.log('errored!');
}