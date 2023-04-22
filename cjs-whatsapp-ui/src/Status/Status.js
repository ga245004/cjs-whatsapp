import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

export default function Status() {

    return (
        <Box sx={{
            background: 'blue',
            position: 'sticky',
            bottom: 0,
            right: 0
        }} maxHeight={24}>
            Status
        </Box>
    )
}