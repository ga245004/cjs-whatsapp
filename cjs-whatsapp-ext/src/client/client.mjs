import { v4 as uuidv4 } from 'uuid';
import WebSocket from 'ws';
import { Logger } from './logger.mjs';

export class ExtClient {

    constructor(port, token, extId) {
        this.port = port;
        this.port = token;
        this.port = extId;
        const url = `ws://localhost:${port}?extensionId=${extId}`;
        Logger.info("Connecting to Native UI...", url);
        this.client = new WebSocket(url);
        this.client.onerror = this.onError;
        this.client.onopen = this.onOpen;
        this.client.onclose = this.onClose;
        this.client.onmessage = this.onMessage;
    }

    onError() {
        Logger.info('Connection error!', 'ERROR');
    }

    onOpen() {
        Logger.info('Connected');
        setTimeout(() => { this.send("Hi") }, 2 * 1000);
    }

    onClose() {
        Logger.info('Connection closed');
        process.exit();
    }

    onMessage(e) {
        const { event, data } = JSON.parse(e.data);
        if (event === "eventToExtension") {
            setTimeout(() => { this.send(`${getTime()} - Thanks for connecting server...`) }, 2 * 1000);
        }
    }

    send(data) {
        const e = {
            id: uuidv4(),
            method: "app.broadcast",
            accessToken: this.token,
            data: { event: "eventFromExtension", data },
        }
        this.client.send(JSON.stringify(e));
    }
}