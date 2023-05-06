import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { Checkbox, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Stack } from '@mui/material';
import RunIcon from "@mui/icons-material/RunCircleTwoTone";
import DeleteIcon from "@mui/icons-material/DeleteForeverOutlined";
import * as Neutralino from "@neutralinojs/lib";
import { AddTemplate } from './AddTemplate';

export class Template {
    id;
    name;
    message;
    media;
}

export default function Templates() {

    const [checked, setChecked] = React.useState(-1);
    const [templates, setTemplates] = React.useState([]);

    const handleToggle = (value) => () => {
        if (checked === value) {
            setChecked(-1);
        }
        else {
            setChecked(value);
        }
    };

    React.useEffect(() => {
        Neutralino.storage.getData("templates").then(data => {
            const templates = JSON.parse(data);
            templates.forEach((t, i) => {
                t.id = i;
            });
            setTemplates(templates);
            setChecked(-1);
        })
    }, []);

    const onAdd = (template) => {
        console.log(template);
        const newTemplates = [template, ...templates];
        newTemplates.forEach((t, i) => {
            t.id = i;
        });
        setTemplates(newTemplates);
        Neutralino.storage.setData('templates',
            JSON.stringify(newTemplates)
        );
        setChecked(-1);
    }

    
    const onEdit = (template, i) => {
        const newTemplates = [...templates];
        const deleted = newTemplates.splice(i, 1, template);
        console.log(i, deleted, newTemplates);
        newTemplates.forEach((t, i) => {
            t.id = i;
        });
        setTemplates(newTemplates);
        Neutralino.storage.setData('templates',
            JSON.stringify(newTemplates)
        );
        setChecked(-1);
    }


    const onDelete = (i) => {
        const newTemplates = [...templates];
        const deleted = newTemplates.splice(i, 1);
        console.log(i, deleted, newTemplates)
        newTemplates.forEach((t, i) => {
            t.id = i;
        });
        setTemplates(newTemplates);
        Neutralino.storage.setData('templates',
            JSON.stringify(newTemplates)
        );
        setChecked(-1);
    }



    const onRun = () => {
        const template = templates.filter(t => t.id === checked);
        if (template && template.length > 0) {
            Neutralino.events.dispatch('sendTemplate', template);
            setChecked(-1);
        }
        else {
            Neutralino.os.showNotification('Oops :/', 'Check a template', 'ERROR');
        }
    }
    const props = {
        templates,
        checked,
        handleToggle,
        onDelete,
        onEdit,
        header: {
            onAdd,
            onRun
        }
    }

    return <ListUI {...props} />
}

function HeaderUI(props) {
    const { onAdd, onRun } = props;
    return (
        <ListSubheader component="div" sx={{ display: 'flex', alignItems: "flex-start", justifyItems: 'flex-start', }}>
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'flex-start' }}>
                <Typography variant="h6">
                    Templates
                </Typography>
            </Box>
            <AddTemplate onAdd={onAdd} />
            <IconButton edge="end" aria-label="Send checked template message to checked clients" color="primary" onClick={onRun}
                title={"Send checked template message to checked clients"}>
                <RunIcon />
            </IconButton>
        </ListSubheader>
    );
}

function ListUI(props) {
    const { templates, checked, handleToggle, onEdit, onDelete,  header } = props;

    return (
        <Box key={'template-container'} sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflowY: 'scroll', maxHeight: 'calc(100vh - 64px - 25px)', flex: 1 }}>
            <HeaderUI {...header} />
            <List key={'template'} sx={{ flexGrow: 1, width: '100%', bgcolor: 'background.paper' }}

            >
                {templates.map((template, index) => {
                    const labelId = `checkbox-list-label-${template.id}`;
                    return (
                        <Box key={labelId}>
                            <ListItem
                                secondaryAction={
                                    <>
                                        <AddTemplate onEdit={onEdit} index={index} template={template} /> 
                                        <IconButton edge="end" aria-label="delete" title='delete'  onClick={() => onDelete(index)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </>
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
                                        <ListItemText id={`${labelId}-message`} secondary={`${template.message}`} />
                                        {template.media && <ListItemText id={`${labelId}-message`} secondary={`${template.media.filename}`} />}
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