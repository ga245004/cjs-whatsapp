import * as React from 'react';
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import { Checkbox } from '@mui/material';

const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
        right: 4,
        top: 20,
        border: `2px solid ${theme.palette.background.paper}`,
        padding: '0 4px',
    },
}));

export default function SelectAllCheckbox({ checkedAll, count }) {
    return (
        <StyledBadge badgeContent={count} color="secondary" title="number of checked client">
            <Checkbox
                edge="start"
                checked={checkedAll}
                tabIndex={-1}
                disableRipple
                inputProps={{ 'aria-labelledby': 'select-all-clients' }}
            />
        </StyledBadge>
    );
}