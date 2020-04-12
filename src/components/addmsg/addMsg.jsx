import React from 'react';
import './addMsg.css'

const AddMsg = () => {
    return (
        <div className="alert-wrapper">
            <div className="alert alert-info custom-alert" role="alert">
                <span>Please select your Store location on the map to continue</span>
            </div>
        </div>
    );
}

export default AddMsg;