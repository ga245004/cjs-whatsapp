import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Checkbox, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Stack } from '@mui/material';
import EditIcon from "@mui/icons-material/EditRounded";
import RunIcon from "@mui/icons-material/RunCircleTwoTone"
import FileOpenIcon from "@mui/icons-material/FileOpen";
import * as Neutralino from "@neutralinojs/lib";

class Template {
    id = 0;
    name = "Good Morning";
    text = "Hello!";
    image = "bg.jpg"
}

const getDummyTemplates = () => {
    return Array.from({ length: 10 }).map((_, i) => i).map(i => {
        const c = new Template();
        c.id = i + 1;
        c.name = `${c.name} ${i}`;
        c.text = `${c.text} ${i}`;
        return c;
    })
}

export default function Templates() {

    const [checked, setChecked] = React.useState([0]);
    const [templates, setTemplates] = React.useState(getDummyTemplates())

    const handleToggle = (value) => () => {
        if (checked === value) {
            setChecked(-1);
        }
        else {
            setChecked(value);
        }
    };

    const onRun = () => {
        const template = templates.filter(t => t.id === checked);
        if(template && template.length > 0){
            Neutralino.events.dispatch('sendTemplate', template);
            setChecked(-1);
        }
        else{
            Neutralino.os.showNotification('Oops :/', 'Check a template', 'ERROR');
        }
    }


    return (
        <Box sx={{ flexGrow: 1, background: 'red', display: 'flex' }}>
            <List sx={{ flexGrow: 1, width: '100%', bgcolor: 'background.paper' }}
                subheader={
                    <ListSubheader component="div" sx={{ display: 'flex', alignItems: "flex-start", justifyItems: 'flex-start', top: 64 }}>
                        <Box sx={{ flex: 1, display: 'flex', alignItems: 'flex-start' }}>
                            <Typography variant="h6">
                                Templates
                            </Typography>
                        </Box>
                        <IconButton edge="end" aria-label="comments" color="primary" onClick={onRun}
                            title={"Send checked template message to checked clients"}>
                            <RunIcon />
                        </IconButton>
                    </ListSubheader>
                }
            >
                {templates.map((template, index) => {
                    const labelId = `checkbox-list-label-${template.id}`;
                    return (
                        <Box key={template.id}>
                            <ListItem

                                secondaryAction={
                                    <IconButton edge="end" aria-label="comments">
                                        <EditIcon />
                                    </IconButton>
                                }
                                disablePadding
                            >
                                <ListItemButton role={undefined} onClick={handleToggle(template.id)} dense>
                                    <ListItemIcon>
                                        <Checkbox
                                            edge="start"
                                            checked={checked === template.id}
                                            tabIndex={-1}
                                            disableRipple
                                            inputProps={{ 'aria-labelledby': labelId }}
                                        />
                                    </ListItemIcon>
                                    <Stack flex={1} direction="column">
                                        <ListItemText id={`${labelId}-name`} primary={`${template.name}`} />
                                        <ListItemText id={`${labelId}-text`} secondary={`${template.text}`} />
                                        <ListItemText id={`${labelId}-text`} secondary={`${template.image}`} />
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