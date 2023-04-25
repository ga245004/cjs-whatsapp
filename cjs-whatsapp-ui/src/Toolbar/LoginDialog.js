import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { WhatsappExt } from '../util/WhatsappExt';
import QRCode from "qrcode-svg";
import { Alert, AlertTitle, Avatar, Box, CircularProgress, Snackbar, TextField } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import { API } from '../util/API';
import * as Neutralino from "@neutralinojs/lib";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));
function LoginDialogTitle(props) {
    const { children, onClose, ...other } = props;

    return (
        <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
}

export default function LoginDialog() {
    const [open, setOpen] = React.useState(false);
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);

    const checkExpireToken = (token) => {
        const decode = JSON.parse(atob(token.split('.')[1]));
        console.log(decode);
        if (decode.exp * 1000 < new Date().getTime()) {
            console.log('Time Expired. Check login again..');
            return false;
        }
        return true;
    };

    const getExpireToken = (token) => {
        const date  = new Date();
        const decode = JSON.parse(atob(token.split('.')[1]));
        console.log(decode);
        if (decode.exp * 1000 < new Date().getTime()) {
            console.log('Time Expired. Check login again..');
            return false;
        }
        return true;
    };

    React.useEffect(() => {
        Neutralino.storage.getData("login").then(data => {
            console.log(data)
        }, () => {
            setIsLoggedIn(false);
            console.log("No login info found....")
        }
        )
    }, []);

    const onBeforeLogin = () => {

    }

    const onLogin = () => {
        //setIsLoggedIn(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            {!isLoggedIn
                && <Button color="inherit" onClick={() => setOpen(true)}> Login </Button>}
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
            >
                <LoginDialogTitle id="customized-dialog-title" onClose={handleClose}>
                    Enter your account details
                </LoginDialogTitle>
                <DialogContent dividers sx={{

                    display: 'flex', flexDirection: 'column',
                    justifyContent: 'flex-start', alignItems: 'center', gridGap: "24px"
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', }}>
                        <img style={{ height: 70, pointerEvents: 'none', userSelect: 'none' }}
                            src={`whatsapp-manager.png`}
                            alt={'Whatsapp web Manager'}
                            loading="lazy"
                        />
                    </Box>
                    <TextField id="outlined-basic" label="Phone Number" variant="outlined" fullWidth />
                    <TextField id="filled-basic" label="Login Key" variant="outlined" fullWidth />
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={onBeforeLogin}>
                        Login
                    </Button>
                </DialogActions>
            </BootstrapDialog>
        </>
    )

}