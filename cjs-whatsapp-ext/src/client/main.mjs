
import { ExtClient } from './client.mjs';
import { Logger, Util } from './extra.mjs';
import { MessageMedia, Client as WhatsappClient, Events as WhatsappEvents } from "whatsapp-web.js";
import axios from "axios";
Logger.info("-------------------Start---------------------------");
Logger.info("Connecting to Native extension...");

const { port, token, extId } = Util.getExtensionDetails();
const chromeOptions = {};



async function loadChromeConfig() {
    const chromePort = port + 1;
    const chromeDevToolJson = `http://localhost:${chromePort}/json/version`;
    const response = await axios({
        method: 'get',
        url: chromeDevToolJson,
        responseType: 'json'
    })
    Logger.info("chrome options ...");
    Logger.info(response.data);
    Object.keys(chromeOptions).forEach(k => delete chromeOptions[k]);
    Object.keys(response.data).forEach(k => chromeOptions[k] = response.data[k]);

    Logger.info("browserWSEndpoint = ", chromeOptions.webSocketDebuggerUrl);
}

function connect() {
    const client = new ExtClient({ port, token, extId });
    let whatsappClient = false;
    let whatsappOptions = {
        puppeteer: {
            headless: true,
            browserWSEndpoint: chromeOptions.webSocketDebuggerUrl
        },
    }
    client.on("ready", () => {

        client.on("whatsappEvents", ({ event, data }) => {
            client.send({ event, data });
        });

        client.on("sentTo", ({ number, data }) => {
            console.log(number, data);
            const { message, media } = data;
            number = number.replace('+', '').replace("-", "");
            if (number.length >= 12) {
                number = number.includes('@c.us') ? number : `${number}@c.us`;
                Logger.info({ number, data });
                const option = {};
                if (media) {
                    const { mimetype, data, filename, filesize } = media;
                    const msgMedia = new MessageMedia(mimetype, data, filename, filesize);
                    option.media = msgMedia;
                }
                whatsappClient.sendMessage(number, message, option);
            }
        });

        client.on("connect", () => {
            if (!whatsappClient) {
                loadChromeConfig().then(() => {
                    Logger.info("loading whatsapp client with options ...", whatsappOptions);
                    whatsappOptions = {
                        puppeteer: {
                            headless: true,
                            browserWSEndpoint: chromeOptions.webSocketDebuggerUrl
                        },
                    }
                    whatsappClient = new WhatsappClient(whatsappOptions);
                    Object.values(WhatsappEvents).forEach(event => {
                        Logger.info("subscribing whatsappEvents =", event);
                        whatsappClient.on(event, (...args) => {
                            client.publish("whatsappEvents", { event, data: args });
                        })
                    })
                    whatsappClient.initialize();
                    Logger.info("starting whats app client...");
                    client.send("starting whats app client...");
                });
            }
            else {
                client.send("already started whatsapp client...");
                Logger.info(whatsappClient.info);
                client.send({ event: 'info', data: whatsappClient.info });
            }
        });
    });
}



connect();