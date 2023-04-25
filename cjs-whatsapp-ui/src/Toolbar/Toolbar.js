import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

import * as Neutralino from "@neutralinojs/lib";
import { WhatsWebURL } from '../util/Constants';
import { WhatsappExt } from '../util/WhatsappExt';
import ConnectDialog from './ConnectDialog';
import LoginDialog from './LoginDialog';

export default function AppToolbar() {

    const [isMaximized, setIsMaximized] = React.useState(false);

    const onExtensionReady = (e) => {
        if (e.detail === "js.neutralino.cjs.whatsapp.extension") {
            WhatsappExt.publish({
                extId : e.detail, data : {
                    event : "loaded",
                    data : {}
                }
            })
        }
    }

    const onEventFromExtension = (e) => {
        if (e.type === "eventFromExtension") {
            WhatsappExt.publish(e.detail)
        }
    }

    React.useEffect(() => {
        Neutralino.events.on("extensionReady", onExtensionReady);
        Neutralino.events.on("eventFromExtension", onEventFromExtension);
        Neutralino.extensions.getStats().then(stats => {
            console.log(stats);
        });
        return () => {
            Neutralino.events.off("eventFromExtension", onEventFromExtension);
            Neutralino.events.off("extensionReady", onExtensionReady);
        }
    }, []);

    React.useEffect(() => {
        const icon = '/logo512.png';
        Neutralino.window.setIcon(icon);
    });

    React.useEffect(() => {
        if (isMaximized) {
            Neutralino.window.unsetDraggableRegion('draggable-window-area');
        }
        else {
            Neutralino.window.setDraggableRegion('draggable-window-area');
        }
    }, [isMaximized]);

    const onDoubleClick = () => {
        if (!isMaximized) {
            Neutralino.window.maximize().then(() => {
                setIsMaximized(true);
            });
        }
        else {
            Neutralino.window.unmaximize().then(() => {
                setIsMaximized(false);
            });
        }
    }

    return (
        <Box sx={{
            position: 'sticky',
            left: 0,
            top: 0,
            zIndex: 1,
        }}>
            <AppBar position="static" sx={{ background: "#09469b" }}>
                <Toolbar sx={{ paddingLeft: '6px' }}>
                    <Box id={"draggable-window-area"} sx={{ display: 'flex', alignItems: 'center', marginLeft: '-24px' }}>
                        <img style={{ height: 64, pointerEvents: 'none', userSelect: 'none' }}
                            src={`whatsapp-manager.png`}
                            alt={'Whatsapp web Manager'}
                            loading="lazy"
                        />
                    </Box>
                    <Box sx={{ flexGrow: 1, height: 64 }} onDoubleClick={onDoubleClick}>

                    </Box>
                    <ConnectDialog />
                    <LoginDialog />
                </Toolbar>
            </AppBar>
        </Box>
    );
}