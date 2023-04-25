import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Checkbox, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Stack } from '@mui/material';
import CommentIcon from "@mui/icons-material/Comment";
import SaveIcon from "@mui/icons-material/FileDownload"
import FileOpenIcon from "@mui/icons-material/FileOpen"
import * as Neutralino from "@neutralinojs/lib";
import Excel from "exceljs";
import { WhatsappExt } from '../util/WhatsappExt';
import Badge from '@mui/material/Badge';
import Info from '@mui/icons-material/CheckBox';
import DeleteIcon from "@mui/icons-material/DeleteOutlined";

class Client {
    id = 0;
    name = "Test";
    phoneNumber = 1234567896;
    countryCode = 91
}

const getDummyClients = () => {
    return Array.from({ length: 100 }).map((_, i) => i).map(i => {
        const c = new Client();
        c.id = i + 1;
        c.name = `${c.name} ${i}`;
        return c;
    })
}

const EXCEL_FILE_OPTIONS = { defaultPath: window.NL_PATH, filters: [{ name: "Excel File", extensions: ["xlsx", "xls", "xlsm"] }] }


export default function Clients() {

    const [checkedAll, setCheckedAll] = React.useState(false);
    const [checked, setChecked] = React.useState([]);
    const [clients, setClients] = React.useState(getDummyClients());

    React.useEffect(() => {
        Neutralino.storage.getData("clients").then(data => {
            const clients = JSON.parse(data);
            clients.forEach((t, i) => { t.id = i; });
            setClients(clients);
            setChecked([]);
        })
    }, []);


    const onSendTemplate = React.useCallback((event) => {
        const templates = event.detail;
        const template = templates[0];
        console.log("sendTemplate",);
        if (checked.length > 5) {
            Neutralino.os.showNotification('Oops :/', 'you can only send 5 message at time before login. please check login.', 'ERROR');
            return;
        }
        Neutralino.os.showNotification(`Sending Messages (${checked.length}) ...`,
            `
            ${template && template.message}
        `);
        checked.forEach(id => {
            const client = clients.find(c => c.id === id);
            const number = `${client.countryCode}${client.phoneNumber}`;
            const data = {
                message: template.message,
                media: template.media
            }
            console.log("sending message to ", number, data);
            WhatsappExt.sentTo(number, data);
        });
        setChecked([]);
    }, [checked]);

    React.useEffect(() => {
        Neutralino.events.on('sendTemplate', onSendTemplate);
        return () => {
            Neutralino.events.off('sendTemplate', onSendTemplate);
        }
    }, [checked]);

    const onCheckAll = () => {
        setCheckedAll(!checkedAll);
        if (!checkedAll) {
            const checkedClients = clients.map(c => c.id);
            setChecked(checkedClients);
        }
        else {
            const checkedClients = [];
            setChecked(checkedClients);
        }
    }

    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];
        console.log(checked)
        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };


    const OnOpen = async () => {
        const files = await Neutralino.os.showOpenDialog("Open Client List", EXCEL_FILE_OPTIONS)
        if (files && files.length > 0) {
            const [file] = files;
            console.log("file opened", file);
            let data = await Neutralino.filesystem.readBinaryFile(file);
            const workbook = new Excel.Workbook();
            await workbook.xlsx.load(data);
            console.log(workbook);
            const worksheet = workbook.worksheets[0];
            const clients = [];
            worksheet.eachRow(function (row, rowNumber) {
                if (rowNumber == 1) return;
                const [_, name, phoneNumber, countryCode] = row.values;
                clients.push({ id: rowNumber, name, phoneNumber, countryCode });
                clients.forEach((t, i) => { t.id = i; });
                Neutralino.storage.setData('clients', JSON.stringify(clients) );
                setClients(clients);
            });
        }
    }

    const OnSave = async () => {
        const newFile = await Neutralino.os.showSaveDialog("Save Client List", EXCEL_FILE_OPTIONS);
        const workbook = new Excel.Workbook();
        const worksheet = workbook.addWorksheet('My Sheet');
        worksheet.columns = [
            { header: 'Name', key: 'name', width: 40 },
            { header: 'Phone Number', key: 'phoneNumber', width: 20 },
            { header: 'Country Code', key: 'countryCode', width: 20 },
        ];
        worksheet.addRows(clients);
        const buffer = await workbook.xlsx.writeBuffer();
        await Neutralino.filesystem.writeBinaryFile(newFile, buffer);
        console.log("file saved", newFile);
    }

    const onDelete = (i) => {
        const newClients = [...clients];
        const deleted = newClients.splice(i, 1);
        console.log(i, deleted, newClients)
        newClients.forEach((c, i) => { c.id = i; });
        setClients(newClients);
        Neutralino.storage.setData('clients', JSON.stringify(newClients) );
        setChecked([]);
    }

    const props = {
        clients,
        checked,
        handleToggle,
        onDelete,
        header: {
            checkedAll,
            onCheckAll,
            OnOpen: () => OnOpen().then(() => { }),
            OnSave
        }
    }

    return (
        <ClientListUI {...props} />
    )
}

function ClientListHeaderUI({ checkedAll, onCheckAll, checked, OnOpen, OnSave }) {
    return (
        <ListSubheader component="div" sx={{ display: 'flex', alignItems: "center", justifyItems: 'flex-start' }}>
            <ListItemIcon onClick={onCheckAll} title={` ${!checkedAll ? 'Check' : 'UnCheck'} all client`}>
                <Checkbox
                    edge="start"
                    checked={checkedAll}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ 'aria-labelledby': 'select-all-clients' }}
                />
            </ListItemIcon>
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'flex-start' }}>
                <Typography variant="h6">
                    Customer Information
                </Typography>
            </Box>
            {checked.length > 0 && <Badge badgeContent={checked.length} color="primary" title="number of checked client">
                <Info color="action" />
            </Badge>}
            <IconButton edge="end" aria-label="open client list" title="open client list" color="primary" onClick={OnOpen}>
                <FileOpenIcon />
            </IconButton>
            <IconButton edge="end" aria-label="save client list" title="save client list" color="primary" onClick={OnSave}>
                <SaveIcon />
            </IconButton>
        </ListSubheader>
    );
}

function ClientListUI(props) {

    const { clients, checked, handleToggle, onDelete, header } = props

    return (
        <Box key={'clients-container'} sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflowY: 'scroll', maxHeight: 'calc(100vh - 64px - 25px)', flex: 1 }}>
            <ClientListHeaderUI {...header} checked={checked} />
            <List key={'clients'} sx={{ flexGrow: 1, width: '100%', bgcolor: 'background.paper' }}

            >
                {clients.map((client, index) => {
                    const labelId = `checkbox-list-label-${client.id}`;
                    return (
                        <Box key={labelId}>
                            <ListItem

                                secondaryAction={
                                    <IconButton edge="end" aria-label="delete" title="Delete Contact" onClick={() => onDelete(index)}>
                                        <DeleteIcon />
                                    </IconButton>
                                }
                                disablePadding
                            >
                                <ListItemButton role={undefined} onClick={handleToggle(client.id)} dense>
                                    <ListItemIcon>
                                        <Checkbox
                                            edge="start"
                                            checked={checked.indexOf(client.id) !== -1}
                                            tabIndex={-1}
                                            disableRipple
                                            inputProps={{ 'aria-labelledby': labelId }}
                                        />
                                    </ListItemIcon>
                                    <Stack flex={1} direction="column">
                                        <ListItemText id={`${labelId}-name`} primary={`${client.name}`} />
                                        <ListItemText id={`${labelId}-phone`} secondary={`+${client.countryCode}-${client.phoneNumber}`} />
                                    </Stack>
                                </ListItemButton>
                            </ListItem>
                            <Divider />
                        </Box>
                    );
                })}
            </List>
        </Box>
    )
}
