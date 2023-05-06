import IconButton from '@mui/material/IconButton';
import EditNoteIcon from "@mui/icons-material/EditOutlined";
import AddIcon from "@mui/icons-material/AddCard";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { useCallback, useState } from 'react';

export function AddClient({ client, index, onAdd, onEdit }) {
    const isEdit = client ? true : false;
    const [open, setOpen] = useState(false);
    const [name, setName] = useState(client ? client.name : '');
    const [phoneNumber, setPhoneNumber] = useState(client ? client.phoneNumber : '');
    const [countryCode, setCountryCode] = useState(client ? client.countryCode : '91');

    const handleClickOpen = () => {
        setOpen(true);
    }

    const handleClose = useCallback(() => {
        setOpen(false);
    }, [setOpen])

    const onBeforeUpdate = useCallback(() => {
        const newClient = {
            ...client,
            name,
            phoneNumber,
            countryCode
        }
        onEdit(newClient, index);
        handleClose();
    }, [client, index, onEdit, handleClose, name, phoneNumber, countryCode])

    const onBeforeAdd = () => {
        const newClient = {
            name,
            phoneNumber,
            countryCode
        }
        onAdd(newClient)
        handleClose();
    }

    return (
        <>
            {!isEdit && <IconButton edge="end" aria-label="add a new contact detail" title="add a new contact detail" color="primary" onClick={handleClickOpen}>
                <AddIcon />
            </IconButton>}
            {isEdit && <IconButton edge="end" aria-label="edit" title="Edit Contact" onClick={handleClickOpen}>
                <EditNoteIcon />
            </IconButton>}
            <Dialog
                fullWidth={true}
                maxWidth={'md'}
                open={open}
                onClose={handleClose}
            >
                <DialogTitle>{isEdit ? 'Edit' : 'Add'} Client</DialogTitle>
                <DialogContent>
                    <Box
                        noValidate
                        component="form"
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            margin: '10px auto',
                            width: 'auto',
                            gap: '24px'
                        }}
                    >
                        <TextField id="name" label="Contact Name" variant="outlined" value={name} onChange={(event) => setName(event.target.value)} />
                        <TextField id="country-code" label="Country Code" variant="outlined" value={phoneNumber} onChange={(event) => setPhoneNumber(event.target.value)} />
                        <TextField id="phone-number" label="Phone Number" variant="outlined" value={countryCode} onChange={(event) => setCountryCode(event.target.value)} />
                    </Box>
                </DialogContent>
                <DialogActions>
                    {!isEdit && <Button onClick={onBeforeAdd}>Add</Button>}
                    {isEdit && <Button onClick={onBeforeUpdate}>Update</Button>}
                </DialogActions>
            </Dialog>
        </>
    )
}