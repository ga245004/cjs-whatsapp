import { accessSync as canAccessFile, existsSync } from "fs";
import { appendFile as appendToFile } from "fs-extra";
import minimist from 'minimist';
import { platform as getPlatform, EOL as NEW_LINE } from 'os';
import { env as getEnv, exit as doExit } from "process";

const Logger = {
    info(...arg) {
        console.info(JSON.stringify([Util.getTime()].concat(arg)));
        appendToFile("info.log", NEW_LINE + JSON.stringify([Util.getTime()].concat(arg)))
    },
    err(...arg) {
        console.info(JSON.stringify([Util.getTime()].concat(arg)));
        appendToFile("err.log", NEW_LINE + JSON.stringify([Util.getTime()].concat(arg)))
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
    },
    findChrome() {
        let chromePath = "";
        const chromeBins = [];
        const platform = getPlatform();
        switch (platform) {
            case "linux": //Linux platform
                chromeBins.push(
                    "/usr/bin/google-chrome-stable",
                    "/usr/bin/google-chrome",
                    "/usr/bin/chromium",
                    "/usr/bin/chromium-browser",
                    "/snap/bin/chromium",
                );
                break;
            case 'darwin': //MacOS, IOS etc platform
                chromeBins.push(
                    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
                    "/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary",
                    "/Applications/Chromium.app/Contents/MacOS/Chromium",
                    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
                    "/usr/bin/google-chrome-stable",
                    "/usr/bin/google-chrome",
                    "/usr/bin/chromium",
                    "/usr/bin/chromium-browser",
                );
                break;
            case 'win32': //Windows platform
                chromeBins.push(
                    getEnv["LocalAppData"] + "/Google/Chrome/Application/chrome.exe",
                    getEnv["ProgramFiles"] + "/Google/Chrome/Application/chrome.exe",
                     getEnv["ProgramFiles(x86)"] + "/Google/Chrome/Application/chrome.exe",
                     getEnv["LocalAppData"] + "/Chromium/Application/chrome.exe",
                     getEnv["ProgramFiles"] + "/Chromium/Application/chrome.exe",
                     getEnv["ProgramFiles(x86)"] + "/Chromium/Application/chrome.exe",
                     getEnv["ProgramFiles(x86)"] + "/Microsoft/Edge/Application/msedge.exe",
                     getEnv["ProgramFiles"] + "/Microsoft/Edge/Application/msedge.exe",
                );
                break;
            default:
                break;
        }
        for (const cPath of chromeBins) {
            try {
                console.log(cPath)
                if(existsSync(cPath)){
                    chromePath = cPath;
                    break;
                }
                
            } catch (error) {
                //did not find chrome find continue to test
                continue;
            }
        }
        return chromePath;
    },
    getChromePath(isExit = true){
        const chromePath = Util.findChrome();
        if(!chromePath){
            console.error("Unable  to find default Google Chrome browser to use.");
            console.error("You need to install Google Chrome at default location.");
            Logger.err("Unable  to find default Google Chrome browser to use.");
            Logger.err("You need to install Google Chrome at default location.");
            if(isExit){
                doExit();
            }
        }
        return chromePath;
    }
}


export {
    Logger,
    Util
};