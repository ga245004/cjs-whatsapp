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

export default function AppToolbar() {

    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
    const [isMaximized, setIsMaximized] = React.useState(false);

    const onQuit = async () => {
        await Neutralino.app.exit();
    }

    const onLogin = () => {
        setIsLoggedIn(true);

    };

    const onConnect = () => {
        Neutralino.window.create(WhatsWebURL, {
            enableInspector: true,
            width: 500,
            height: 300,
            maximizable: false,
            exitProcessOnClose: true,
        }).then(result => {
            console.log(result);
        })
    };
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
                    <Button color="inherit" onClick={onConnect}>Connect</Button>
                    {!isLoggedIn && <Button color="inherit" onClick={onLogin}>Login</Button>}
                    {isLoggedIn && <>
                        <Button color="inherit">Open</Button>
                        <Button color="inherit">Save</Button>
                    </>}
                    <Button color="inherit" onClick={onQuit}>Quit</Button>
                </Toolbar>
            </AppBar>
        </Box>
    );
}