import { v4 as uuidv4 } from 'uuid';
import WebSocket from 'ws';
import { Logger, Util } from './extra.mjs';

let EXT_CLIENT;

export function ExtClient({ port, token, extId }) {
    const Instance = {};
    Instance.port = port;
    Instance.token = token;
    Instance.extId = extId;

    Instance.events = {};

    Instance.on = function (event, callback) {
        if (!Instance.events[event]) {
            Instance.events[event] = callback;
        }
        else {
            throw new Error(`${event} already subscribed..`);
        }
    }

    Instance.publish = function (event, data) {
        Logger.info(event, data);
        if (event != "ready" && Instance.events[event]) {
            const callback = Instance.events[event];
            callback(data);
        }
    }


    Instance.onError = function (e) {
        Logger.info('Connection error!', 'ERROR');
    }

    Instance.onOpen = function (e) {
        Logger.info('Connected');
        const callback = Instance.events["ready"];
        callback && callback();
    }

    Instance.onClose = function (e) {
        Logger.info('Connection closed', e);
        setTimeout(() => process.exit(), 2 * 1000)
    }

    Instance.onMessage = function (e) {
        const { event, data } = JSON.parse(e.data);
        if (event === "eventToExtension" && data && data.extId === Instance.extId) {
            console.log({ event, data })
            if (typeof data === 'object') {
                const { event, data: eventData } = data
                Instance.publish(event, eventData);
            }
            Instance.publish("message", data);
        }
    }

    Instance.send = function (data) {
        const e = {
            id: uuidv4(),
            method: "app.broadcast",
            accessToken: Instance.token,
            data: { event: "eventFromExtension", data: { extId: Instance.extId, data } },
        }

        Instance.client.send(JSON.stringify(e));
    }


    const url = `ws://localhost:${port}?extensionId=${extId}`;
    Instance.client = new WebSocket(url);
    Instance.client.onerror = Instance.onError;
    Instance.client.onopen = Instance.onOpen;
    Instance.client.onclose = Instance.onClose;
    Instance.client.onmessage = Instance.onMessage;


    return Instance;
}

process.on('uncaughtException', function (err) {
    console.log('Caught exception: ' + err);
    Logger.err('Caught exception: ' + err, JSON.stringify(err));
});
