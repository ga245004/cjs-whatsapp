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
import { Alert, AlertTitle, Avatar, Box, CircularProgress, Snackbar } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import { API } from '../util/API';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

function ConnectDialogTitle(props) {
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

export default function ConnectDialog() {
    const [open, setOpen] = React.useState(false);
    const [qrCode, setSetQrCode] = React.useState("");
    const [status, setStatus] = React.useState("");
    const [isRefresh, setIsRefresh] = React.useState(false);
    const [isReady, setIsReady] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [info, setInfo] = React.useState(null);

    const onQrCode = ([qrCode]) => {
        console.log(qrCode);
        setSetQrCode(qrCode);
    }
    const onLoaded = () => {
        setOpen(false);
        setSetQrCode("");
        setStatus("")
        setIsRefresh(false);
        setIsReady(false);
        setIsLoading(false);
        setInfo(null);
    }
    const onLoading = ([progress, message]) => {
        console.log(progress, message);
        setIsLoading(true);
    }
    const onAuthenticated = (args) => {
        setIsLoading(false);
        setOpen(false);
    }

    const onReady = (args) => {
        setIsReady(true);
        WhatsappExt.send("connect", {});
    }

    const onInfo = (info) => {
        console.log(info);
        if(info && info.pushname){
            setInfo(info);
            setIsReady(true);
            setOpen(false);
            setIsRefresh(false);
        }
    }

    React.useEffect(() => {
        WhatsappExt.on("loaded", onLoaded);
        WhatsappExt.on("qr", onQrCode);
        WhatsappExt.on("loading_screen", onLoading);
        WhatsappExt.on("authenticated", onAuthenticated);
        WhatsappExt.on("ready", onReady);
        WhatsappExt.on("info", onInfo);
        return () => {
            WhatsappExt.off("loaded", onLoaded);
            WhatsappExt.off("qr", onQrCode);
            WhatsappExt.off("loading_screen", onLoading);
            WhatsappExt.off("authenticated", onAuthenticated);
            WhatsappExt.off("ready", onReady);
            WhatsappExt.off("info", onInfo);
        }
    }, []);

    const handleClickOpen = () => {
        setSetQrCode("");
        WhatsappExt.isLoaded().then(() => {
            setOpen(true);
            WhatsappExt.send("connect", {}).then(re => {
                console.log("whatsapp starting..", re);
            });
            setIsRefresh(false);
        },
            () => {
                setOpen(false);
                console.log("Whatsapp web service is down..")
                setStatus("Whatsapp web service is down..");
                setIsRefresh(true);

            });
    };
    const onRefresh = () => {
        API.refresh();
        API.getStats().then(console.log)
    }
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            {!isReady && !isRefresh && <Button color="inherit" onClick={handleClickOpen}>
                Connect
            </Button>}
            {!isReady && isRefresh && <Button color="inherit" onClick={onRefresh}>
                Refresh
            </Button>}
            {isReady && !isRefresh  && 
                <Avatar
                    title={`${info && info.me && WhatsappExt.formatNumber(info.me.user)}` }
                    alt={info && info.pushname}
                    src="/static/images/avatar/1.jpg"
                    sx={{ width: 32, height: 32 }}
                />
            }
            <Snackbar open={!!(status && status.length > 0)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert severity="error" sx={{ width: '100%' }} onClose={() => setStatus("")}>
                    {status}
                </Alert>
            </Snackbar>
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
            >
                <ConnectDialogTitle id="customized-dialog-title" onClose={handleClose}>
                    Connect to Whatsapp Web
                </ConnectDialogTitle>
                <DialogContent dividers sx={{ width: 326, height: 326, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    {!isLoading && qrCode && <Box sx={{ width: 256, height: 256 }} dangerouslySetInnerHTML={{ __html: new QRCode(qrCode).svg() }} />}
                    {!isLoading && !status && !qrCode && <Skeleton variant="rectangular" width={256} height={256} />}
                    {isLoading && <Box width={256} height={256} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}> <CircularProgress sx={{ width: '128px !important', height: '128px !important' }} /> </Box>}
                </DialogContent>
                <DialogActions>

                </DialogActions>
            </BootstrapDialog>
        </div>
    );
}