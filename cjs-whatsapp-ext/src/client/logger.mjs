import { appendFile } from "fs-extra"
import { EOL } from 'os'
export class Logger {
    static info(...arg) {
        appendFile("info.log", JSON.stringify([EOL, Util.getTime()].concat(arg)))
    }
}

export class Util {
    static getTime() {
        return new Date().toISOString().split("T")[1].split(".")[0]
    }
}