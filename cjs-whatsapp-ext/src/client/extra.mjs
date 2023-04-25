import { appendFile } from "fs-extra";
import minimist from 'minimist';
import { EOL } from 'os';

const Logger = {
    info(...arg) {
        console.info(JSON.stringify([Util.getTime()].concat(arg)));
        appendFile("info.log", EOL + JSON.stringify([Util.getTime()].concat(arg)))
    },
    err(...arg) {
        console.info(JSON.stringify([Util.getTime()].concat(arg)));
        appendFile("err.log", EOL + JSON.stringify([Util.getTime()].concat(arg)))
    }
};

const Util = {
    getTime() {
        return new Date().toISOString().split("T")[1].split(".")[0]
    },
    getExtensionDetails() {
        const argv = minimist(process.argv.slice(2));
        let port = argv['nl-port'];
        let token = argv['nl-token'];
        let extId = argv['nl-extension-id'];
        return { port, token, extId };
    },
    getExtensionServerUrl() {
        const { port, extId } = Util.getExtensionDetails();
        Logger.info(argv);
        return `ws://localhost:${port}?extensionId=${extId}`;
    }
}


export {
    Logger,
    Util
};