import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import SvgIcon from '@material-ui/core/SvgIcon';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';


import './addbusiness.css'


const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
            width: '100%',
        },
    },

    btn: {
        width: '38px',
        height: '38px',

        margin: '0px!important',
    },

    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));



const AddForm = (props) => {

    const classes = useStyles();

    const [alert, setAlert] = useState({ display: false, msg: "" })
    const [formStage, setFormStage] = useState('basic')
    const [doneLoading, setDoneLoading] = useState(false)

    const handleFormClick = (stage) => {
        setFormStage(stage)
    }



    const isStoreValid = props.store.name && props.store.type && props.store.items.every(i => Object.values(i).every(v => v));

    const handleStoreCreate = () => {
        setAlert({ display: false, msg: "" })
        if (isStoreValid) {
            const newStore = props.store;
            setDoneLoading(true)
            fetch('https://covid-19-shopping.herokuapp.com/newstore', {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newStore)
            })
                .then(response => response.json())
                .then(res => {
                    if (res.id) {
                        setDoneLoading(false)
                        props.handleAddStore(res)
                    } else {
                        setAlert({ display: true, msg: res })
                        setDoneLoading(false)
                    }
                })
                .catch(() => {
                    setAlert({ display: true, msg: "An error has occured while trying to fetch" })
                    setDoneLoading(false)
                })

        } else {
            setAlert({ display: true, msg: "Please fill all the inputs before clicking Done" })
        }
    }



    if (formStage === 'basic') {
        return (
            <div className="form-wrapper">
                <main className="form pa4 black-80">
                    <form className="measure center" noValidate autoComplete="off" >
                        <fieldset id="basic-add-form" className="ba b--transparent ph0 mh0">
                            <legend className="f4 fw6 ph0 mh0">Add your own business to manage</legend>
                            <Divider />
                            {alert.display && <div style={{ margin: 0, textAlign: 'center' }} className="alert alert-danger" role="alert">{alert.msg}</div>}
                            <Divider />
                            <div className={`mt3 ${classes.root}`}>
                                <TextField name="name" onChange={props.handleInputChange} value={props.store.name} label="Store name" />
                            </div>
                            <div className={`mt3 ${classes.root}`}>
                                <FormControl className={classes.formControl}>
                                    <InputLabel>Store type</InputLabel>
                                    <Select
                                        onChange={props.handleInputChange}
                                        value={props.store.type}
                                        name="type"
                                    >
                                        <MenuItem value={"food"}>Bakery shop</MenuItem>
                                        <MenuItem value={"some other shit"}>Butcher</MenuItem>
                                        <MenuItem value={"Books"}>Books</MenuItem>
                                        <MenuItem value={"Fishmonger"}>Fishmonger</MenuItem>
                                        <MenuItem value={"Grocery"}>Grocery</MenuItem>
                                        <MenuItem value={"Clothing"}>Clothing</MenuItem>
                                        <MenuItem value={"Medicine"}>Medicine</MenuItem>
                                        <MenuItem value={"Super Market"}>Super Market</MenuItem>
                                        <MenuItem value={"Tobacconist"}>Tobacconist</MenuItem>
                                        <MenuItem value={"Florist"}>Florist</MenuItem>
                                        <MenuItem value={"Hardware"}>Hardware</MenuItem>
                                        <MenuItem value={"Optician"}>Optician</MenuItem>
                                        <MenuItem value={"Jewellery"}>Jewellery</MenuItem>
                                        <MenuItem value={"Oil station"}>Oil station</MenuItem>
                                        <MenuItem value={"Library"}>Library</MenuItem>
                                        <MenuItem value={"Other"}>Other</MenuItem>

                                    </Select>
                                </FormControl>

                            </div>
                            <div className={`mt3 ${classes.root}`}>
                                <TextField
                                    label="Geometric location"
                                    defaultValue={`lat: ${props.lat}, lng: ${props.lng}`}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    variant="outlined"
                                />

                            </div>
                        </fieldset>


                        {/* ////////////////////////////// */}



                    </form>

                    <div className="form-btn-wrapper">
                        <Button style={{ margin: '0px 10px' }} onClick={props.onCancel} color="primary">Cancel</Button>
                        <Button onClick={() => handleFormClick('items')} variant="contained" color="primary">Next</Button>
                    </div>

                </main>

            </div>

        )
    } else if (formStage === 'items') {
        return (
            <div className="form-wrapper">
                <main className="form pa4 black-80">
                    <legend className="f4 fw6 ph0 mh0">Add Products to your business</legend>
                    <Divider />
                    {alert.display && <div style={{ margin: 0, textAlign: 'center' }} className="alert alert-danger" role="alert">{alert.msg}</div>}
                    <Divider />
                    <form className={`measure center`} noValidate autoComplete="off">
                        <fieldset id="basic-add-form" className="ba b--transparent ph0 mh0">

                            {/* // THIS IS THE LINE */}


                            {
                                props.store.items.map((item, i) => {
                                    return (
                                        <div key={i} className={`mt3 item-input-wrapper`}>
                                            <TextField onChange={(e) => props.handleItemChange('name', e, i)} value={item.name} style={{ width: '40%' }} id="item-name" label="Item name" />
                                            <TextField onChange={(e) => props.handleItemChange('quantity', e, i)} value={item.quantity} style={{ width: '30%' }} id="item-quantity" label="quantity" />
                                            <TextField onChange={(e) => props.handleItemChange('unit', e, i)} value={item.unit} style={{ width: '20%' }} id="item-unit" label="Unit" />
                                            <span className={classes.btn}>
                                                <IconButton onClick={(e) => props.deleteItem(i, e)} aria-label="delete">
                                                    <SvgIcon style={{ color: 'red' }} >
                                                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                                                    </SvgIcon>
                                                </IconButton>
                                            </span>

                                        </div>
                                    )
                                })
                            }


                        </fieldset>

                    </form>
                    <div style={{ width: '100%', height: '80px', display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
                        <Button style={{ backgroundColor: '#388e3c', color: 'white' }} onClick={props.addItem} variant="contained"> + Add more</Button>
                    </div>
                    <div className="form-btn-wrapper">
                        <Button style={{ margin: '0px 10px' }} onClick={props.onCancel} color="primary">Cancel</Button>
                        <Button style={{ margin: '0px 10px' }} onClick={() => handleFormClick('basic')} color="secondary">Back</Button>

                        <Button disabled={doneLoading} onClick={() => handleStoreCreate()} variant="contained" color="primary">
                            {doneLoading && <CircularProgress size={24} />}
                            {!doneLoading && "Done"}
                        </Button>
                        {/*  <Button disabled={props.btnLoading} onClick={() => props.handleFormClick('finish')} variant="contained" color="primary">
                            {props.btnLoading && <CircularProgress size={24} />}
                            {!props.btnLoading && "Done"}
                        </Button> */}
                    </div>
                </main>
            </div>


        )
    }


}

export default AddForm;