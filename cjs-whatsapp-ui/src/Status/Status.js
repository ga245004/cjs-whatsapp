import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { WhatsappExt } from '../util/WhatsappExt';

export default function Status() {
    const [message, setMessage] = React.useState({
        from: "",
        body: "",
        _data : {}
    });

    const onMessage = ([msg]) => {
        setMessage(msg);
    }
    React.useEffect(() => {
        WhatsappExt.on("message", onMessage);
        return () => {
            WhatsappExt.off("message", onMessage);
        }
    }, []);

    return (
        <Box sx={{
            background: '#09469b',
            position: 'sticky',
            bottom: 0,
            right: 0,
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            minHeight: 24,
            fontSize: '12px',
            padding: "0 12px"

        }} maxHeight={24}>
            
            {message && message.from && <Box>
                {`Latest Message : ${message._data.notifyName} (${WhatsappExt.formatNumber(message.from)}) >   `}
                {message && message.body.substr(0, 100)}
            </Box>}
            <Box flex={1}></Box>
            {<Box> {`For support Whatsapp @ +91-8109118068`}</Box>}
        </Box>
    )
}