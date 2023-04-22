import minimist from 'minimist';
import * as websocket from 'websocket';
import { v4 as uuidv4 } from 'uuid';
import chalk from "chalk";

import AUTH_CONFIG from "auth_info.json";

const argv = minimist(process.argv.slice(2));
const WS = websocket.default.w3cwebsocket;

// Obtain required params to start a WS connection from CLI args.
let NL_PORT = argv['nl-port'];
let NL_TOKEN = argv['nl-token'];
let NL_EXTID = argv['nl-extension-id'];
if (!NL_PORT) {
    NL_PORT = AUTH_CONFIG.port;
}
if (!NL_TOKEN) {
    NL_TOKEN = AUTH_CONFIG.NL_TOKEN;
}
if (!NL_TOKEN) {
    NL_TOKEN = AUTH_CONFIG.NL_TOKEN;
}
if (!NL_EXTID) {
    NL_EXTID = "js.neutralino.cjs-whatsapp-extension";
}

let client = new WS(`ws://localhost:${NL_PORT}?extensionId=${NL_EXTID}`);

client.onerror = function () {
    log('Connection error!', 'ERROR');
};

client.onopen = function () {
    log('Connected');
};

client.onclose = function () {
    log('Connection closed');
    // Make sure to exit the extension process when WS extension is closed (when Neutralino app exits)
    process.exit();
};

client.onmessage = function (e) {
    if (typeof e.data === 'string') {
        let message = JSON.parse(e.data);

        // Use extensions.dispatch or extensions.broadcast from the app,
        // to send an event here
        switch (message.event) {
            case 'eventToExtension':
                log(message.data);
                // Use Neutralinojs server's messaging protocol to trigger native API functions
                // Use app.broadcast method to send an event to all app instances
                client.send(JSON.stringify({
                    id: uuidv4(),
                    method: 'app.broadcast',
                    accessToken: NL_TOKEN,
                    data: {
                        event: 'eventFromExtension',
                        data: 'Hello app!'
                    }
                }));
                break;
        }
    }
};

// Always good to log some useful things from extension
// You also can write to neutralinojs.log by calling debug.log
// But, don't try to manipulate the log file directly via the extension process.
function log(message, type = 'INFO') {
    let logLine = `[${NL_EXTID}]: `;
    switch (type) {
        case 'INFO':
            logLine += chalk.green(type);
            logLine += ' ' + message;
            console.log(logLine);
            break;
        case 'ERROR':
            logLine += chalk.red(type);
            logLine += ' ' + message;
            console.error(logLine);
            break;
    }
}