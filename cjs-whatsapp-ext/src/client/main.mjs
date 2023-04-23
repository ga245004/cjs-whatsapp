import minimist from 'minimist';
import { Client as WhatsappClient } from 'whatsapp-web.js';
import qrcode from "qrcode-terminal";
import { ExtClient } from './client.mjs';
import { appendFile, appendFileSync } from 'fs-extra';
import { Logger } from './logger.mjs';
Logger.info("-------------------Start---------------------------");
Logger.info("Connecting to Native extension...");

const argv = minimist(process.argv.slice(2));
let NL_PORT = argv['nl-port'];
let NL_TOKEN = argv['nl-token'];
let NL_EXTID = argv['nl-extension-id'];
Logger.info(argv)
const client = new ExtClient(NL_PORT, NL_TOKEN, NL_EXTID);

// const whatsappClient = new WhatsappClient();

// whatsappClient.on('qr', (qr) => {
//     // Generate and scan this code with your phone
//     console.log('QR RECEIVED', qr);
//     qrcode.generate(qr, { small: true });
// });

// whatsappClient.on('ready', () => {
//     console.log('Client is ready!');
// });

// whatsappClient.on('message', msg => {
//     if (msg.body == '!ping') {
//         msg.reply('pong');
//     }
// });

// whatsappClient.initialize().then(() => {
//     console.log("Hi");
// });