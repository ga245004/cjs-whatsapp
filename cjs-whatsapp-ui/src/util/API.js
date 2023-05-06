import * as Neutralino from "@neutralinojs/lib";

const EXT_NAME = "js.neutralino.cjs.whatsapp.extension";
const API = function () {
    const events = [];
    const refresh = () => {
       window.location.reload();
    }
    const getStats = () => {
        return Neutralino.extensions.getStats();
    }
    const isLoaded = () =>{
        return new Promise((resolve, reject) => {
            Neutralino.extensions.getStats().then((stats) => {
                console.log(stats, stats.connected.indexOf(EXT_NAME))
                if(stats.connected.indexOf(EXT_NAME) !== -1){
                    resolve();
                }
                else{
                    reject();
                }
            });
        })
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
            if(events[event]){
                const callback =  events[event];
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
        refresh,
        getStats,
        isLoaded,
        send,
        publish,
        on,
        off
    }
}();

export {
    API
}


export const checkExpireToken = (token) => {
    const decode = JSON.parse(atob(token.split('.')[1]));
    console.log(decode);
    if (decode.exp * 1000 < new Date().getTime()) {
        console.log('Time Expired. Check login again..');
        return false;
    }
    return true;
};

export const getExpireToken = (token) => {
    const decode = JSON.parse(atob(token.split('.')[1]));
    console.log(decode);
    if (decode.exp * 1000 < new Date().getTime()) {
        console.log('Time Expired. Check login again..');
        return false;
    }
    return true;
};
