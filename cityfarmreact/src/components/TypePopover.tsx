import { Popover, Typography } from "@mui/material"
import React, { useState } from "react"

export const TypePopover = ({schemaName}: {schemaName: string}) => {
    const [anchorEl, setAnchorEl] = useState<any>(null);

    const open = Boolean(anchorEl);
    console.debug("open", open)

    return <div>
        <Typography
                aria-owns={open ? 'mouse-over-popover' : undefined}
                aria-haspopup="true"
                onMouseEnter={(e) => setAnchorEl(e.currentTarget)}
                onMouseLeave={() => setAnchorEl(null)}
                style={open ? {opacity: '50%'} : {}}
            >
                {schemaName}
            </Typography>
        <Popover id="mouse-over-popover"
                sx={{pointerEvents: 'none'}}
            open={open} anchorEl={anchorEl} onClose={() => setAnchorEl(null)} anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }} disableRestoreFocus>
            <p>Click to filter by this animal type, and see its custom fields</p>
        </Popover>
    </div> 
        

}