import * as Neutralino from "@neutralinojs/lib";

const EXT_NAME = "js.neutralino.cjs.whatsapp.extension";
const WhatsappExt = function () {
    const events = [];
    const formatNumber = (id) => {
        const number = id.split("@")[0];
        return `+${number.substr(0, 2)}-${number.substr(2)}`;
    }
    const isLoaded = () => {
        return new Promise((resolve, reject) => {
            Neutralino.extensions.getStats().then((stats) => {
                console.log(stats, stats.connected.indexOf(EXT_NAME))
                if (stats.connected.indexOf(EXT_NAME) !== -1) {
                    resolve();
                }
                else {
                    reject();
                }
            });
        })
    }
    const sentTo = (number, data) => {
        number = number.replace('+', '').replace("-", "");
        number = number.includes('@c.us') ? number : `${number}@c.us`;
        WhatsappExt.send("sentTo", { number, data });
    }
    const send = (event, data) => {
        return Neutralino.extensions.dispatch(
            EXT_NAME,
            'eventToExtension',
            { extId: EXT_NAME, event, data }
        );
    };
    const publish = ({ extId, data }) => {
        if (extId === EXT_NAME) {
            const { event, data: EventData } = data;
            console.log(data);
            if (events[event]) {
                const callback = events[event];
                callback(EventData);
            }
        }
    }
    const on = (eventName, callback) => {
        events[eventName] = callback;
    }
    const off = (eventName, callback) => {
        delete events[eventName];
    }
    return {
        formatNumber,
        isLoaded,
        sentTo,
        send,
        publish,
        on,
        off
    }
}();

export {
    WhatsappExt
}