import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown'

import '../header.css'


const Profile = (props) => {


    return (
        <div className="profile-wrapper">
            {
                props.signedIn
                    ? <>
                        <Dropdown>
                            <Dropdown.Toggle className="dropdown-wrap" id="dropdown-basic">{props.username}</Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={props.onSignOut} >Sign out</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </>
                    : <>
                        <p className="link" onClick={() => props.routeChange('login')}>Sign in</p>
                        <p className="link" onClick={() => props.routeChange('register')}>Register</p>
                    </>
            }

        </div>
    )




}

export default Profile;