import React from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';


const ProfileMenu = (props) => {


    return (
        <Menu
            anchorEl={props.anchorEl}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            getContentAnchorEl={null}
            id="interaction-menu"
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={props.isMenuOpen}
            onClose={props.handleMenuClose}
        >
            {props.signedIn && (
                <div>
                    <MenuItem onClick={props.onProfileOpen}>Profile</MenuItem>
                    <MenuItem onClick={props.onSignOut}>Sign out</MenuItem>
                </div>
            )}
            {!props.signedIn && (
                <div>
                    <MenuItem onClick={() => props.routeChange('login')}>Sign in</MenuItem>
                    <MenuItem onClick={() => props.routeChange('register')}>Register</MenuItem>
                </div>
            )}
        </Menu>
    )




}

export default ProfileMenu;