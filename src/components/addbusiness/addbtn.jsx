import React from 'react';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import './addbusiness.css'

const AddBtn = (props) => {
    return (
        <Fab className="floating-btn" color="secondary" onClick={props.onClick} aria-label="add">
            <AddIcon />
        </Fab>
    );
}

export default AddBtn;