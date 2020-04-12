import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import LinearProgress from '@material-ui/core/LinearProgress';
import './loading.css'

const Loading = () => {


    return (
        <>
            <LinearProgress />
            <div className="loading-wrapper">
                <CircularProgress />
            </div>
        </>
    );
}

export default Loading;