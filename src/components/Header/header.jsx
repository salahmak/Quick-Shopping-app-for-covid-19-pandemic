import React from 'react';
import Profile from './profile/profile.jsx'
import './header.css'

const Header = (props) => {
    return (



        <nav className="navbar navbar-dark justify-content-between">
            <span className="navbar-brand">Quick Shopping</span>
            <Profile username={props.username} onSignOut={props.onSignOut} routeChange={props.routeChange} signedIn={props.signedIn} />
        </nav>


    );
}

export default Header;