import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { ButtonBase, IconButton, Typography, styled } from "@mui/material";
import AddIcon from "@mui/icons-material/AddCard";
import InputUnstyled from '@mui/base/InputUnstyled';
import * as Neutralino from "@neutralinojs/lib";
import EditNoteIcon from "@mui/icons-material/EditOutlined";
import { TemplateEditor } from './TemplateEditor';
import { SerializeSlate } from './TemplateParser';

export let sampleMedia = {
    mimetype: "image/png",
    filename: "logo.png",
    filesize: "3090",
    data: `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`
}


const Image_FILE_OPTIONS = { defaultPath: window.NL_PATH, filters: [{ name: "Image File", extensions: ["png", "jpg", "jpge", "gif"] }] }

const MINE_TYPE = {
    "png": "image/png",
    "jpg": "image/jpg",
    "jpge": "image/jpge",
    "gif": "image/gif"
}

function _arrayBufferToBase64(buffer) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}


export function AddTemplate({ onAdd, onEdit, index, template }) {
    const isEdit = template ? true : false;
    const [open, setOpen] = useState(false);
    const [name, setName] = useState(template ? template.name : "New Name");
    const [slate, setSlate] = useState(template ? template.slate : undefined);
    const [media, setMedia] = useState(template ? template.media : undefined);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const onBeforeAdd = () => {
        let m;
        if (media) {
            m = media;
        }
        const template = {
            name: name,
            message: SerializeSlate(slate, true),
            slate: slate,
            media: m
        }
        console.log(onAdd, template)
        onAdd && onAdd(template);
        handleClose();
    }

    const onBeforeUpdate = () => {
        let m;
        if (media) {
            m = media;
        }
        const template = {
            name: name,
            message: SerializeSlate(slate, true),
            slate: slate,
            media: m
        }
        console.log(onEdit, template)
        onEdit && onEdit(template, index);
        handleClose();
    }

    const UploadImage = () => {
        Neutralino.os.showOpenDialog("Select an image", Image_FILE_OPTIONS).then(([img]) => {
            if (img) {
                Neutralino.filesystem.readBinaryFile(img).then(data => {
                    const filesize = data.byteLength;
                    img = img.replaceAll("\\", "/");
                    const filename = img.substring(img.lastIndexOf("/") + 1) + "";
                    const base64String = _arrayBufferToBase64(data);
                    let minetype = "image/png";
                    if (MINE_TYPE[filename.split(".")[1]]) {
                        minetype = MINE_TYPE[filename.split(".")[1]]
                    }
                    console.log(filesize, filename, minetype, base64String);
                    setMedia({ filesize, filename, minetype, data: base64String });
                });
            }
        });
    }

    const onEditorTemplateChange = (value) => {
        setSlate(value);
    }

    return (
        <>
            {!isEdit && <IconButton edge="end" aria-label="add a new template" title="add a new template" color="primary" onClick={handleClickOpen}>
                <AddIcon />
            </IconButton>}
            {isEdit && <IconButton edge="end" aria-label="edit" title='edit' onClick={handleClickOpen}>
                <EditNoteIcon />
            </IconButton>}
            <Dialog
                fullWidth={true}
                maxWidth={'md'}
                open={open}
                onClose={handleClose}
            >
                <DialogTitle>Add Template</DialogTitle>
                <DialogContent>
                    <Box
                        noValidate
                        component="form"
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            m: 'auto',
                            width: 'auto',
                        }}
                    >
                        <InputUnstyled style={{ marginBottom: '12px', display: 'flex', flexDirection: 'column' }}
                            placeholder="enter your whatsapp message template.."
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <Box sx={{ display: 'flex' }}>

                            <ImageButton title='Upload image'
                                focusRipple
                                style={{
                                    flex: 1
                                }}
                                onClick={UploadImage}
                            >
                                <ImageSrc style={{ backgroundImage: `url(data:${media && media.minetype};base64,${media && media.data})` }} />
                                <ImageBackdrop className="MuiImageBackdrop-root" />
                                <Image>
                                    <Typography
                                        component="span"
                                        variant="subtitle1"
                                        color="inherit"
                                        sx={{
                                            position: 'relative',
                                            p: 4,
                                            pt: 2,
                                            pb: (theme) => `calc(${theme.spacing(1)} + 6px)`,
                                        }}
                                    >
                                        {media && media.filename}
                                        <ImageMarked className="MuiImageMarked-root" />
                                    </Typography>
                                </Image>
                            </ImageButton>
                        </Box>
                        
                        <TemplateEditor value={slate} onChange={onEditorTemplateChange}/>
                    </Box>
                </DialogContent>
                <DialogActions>
                    {!isEdit && <Button onClick={onBeforeAdd}>Add</Button>}
                    {isEdit && <Button onClick={onBeforeUpdate}>Update</Button>}
                </DialogActions>
            </Dialog>
        </>
    );
}


const ImageButton = styled(ButtonBase)(({ theme }) => ({
    position: 'relative',
    height: 200,
    [theme.breakpoints.down('sm')]: {
        width: '100% !important', // Overrides inline-style
        height: 100,
    },
    '&:hover, &.Mui-focusVisible': {
        zIndex: 1,
        '& .MuiImageBackdrop-root': {
            opacity: 0.15,
        },
        '& .MuiImageMarked-root': {
            opacity: 0,
        },
        '& .MuiTypography-root': {
            border: '4px solid currentColor',
        },
    },
}));

const ImageSrc = styled('span')({
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundSize: 'cover',
    backgroundPosition: 'center 40%',
});

const Image = styled('span')(({ theme }) => ({
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.common.white,
}));

const ImageBackdrop = styled('span')(({ theme }) => ({
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: theme.palette.common.black,
    opacity: 0.4,
    transition: theme.transitions.create('opacity'),
}));

const ImageMarked = styled('span')(({ theme }) => ({
    height: 3,
    width: 18,
    backgroundColor: theme.palette.common.white,
    position: 'absolute',
    bottom: -2,
    left: 'calc(50% - 9px)',
    transition: theme.transitions.create('opacity'),
}));
