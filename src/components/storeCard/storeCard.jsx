import React from 'react';
import './addbusiness.css'
import { Button } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import SvgIcon from '@material-ui/core/SvgIcon';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import CircularProgress from '@material-ui/core/CircularProgress';
import DeleteIcon from '@material-ui/icons/Delete';


const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
            width: '100%',
        },
    },
    button: {
        margin: theme.spacing(1),
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
    }
}));





const StoreCard = (props) => {





    const classes = useStyles();

    if (props.user.id !== props.store.ownerId) {
        return (
            <div className="form-wrapper">
                <main className="form pa4 black-80">
                    <legend className="f4 fw6 ph0 mh0 tc">{props.store.name}</legend>
                    <legend className="f6 fw6 ph0 mh0 tc">{props.store.type}</legend>
                    <form className={`measure center`} noValidate autoComplete="off">
                        <fieldset id="basic-add-form" className="ba b--transparent ph0 mh0">
                            {
                                props.store.items.map((item, i) => {
                                    return (
                                        <div key={i} className={`mt3 item-input-wrapper`}>
                                            <TextField InputProps={{ readOnly: true, }} value={item.name} style={{ width: '40%' }} id="standard-basic" label="Item name" />
                                            <TextField InputProps={{ readOnly: true, }} value={item.quantity} style={{ width: '30%' }} id="standard-basic" label="quantity" />
                                            <TextField InputProps={{ readOnly: true, }} value={item.unit} style={{ width: '20%' }} id="standard-basic" label="Unit" />
                                        </div>
                                    )
                                })
                            }
                        </fieldset>
                    </form>
                    <div className="form-btn-wrapper">
                        <Button onClick={props.onItemsClose} variant="contained" color="primary">Close</Button>
                    </div>
                </main>
            </div>

        )
    } else {
        return (
            <div className="form-wrapper">
                <main className="form pa4 black-80">
                    <div className={`mt3 ${classes.root}`}>
                        <TextField name="name" value={props.store.name} onChange={props.handleChange} id="standard-basic" label="Store name" />
                    </div>
                    <div className={`mt3 ${classes.root}`}>
                        <FormControl className={classes.formControl}>
                            <InputLabel id="demo-simple-select-label">Store type</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                name="type"
                                onChange={props.handleChange}
                                value={props.store.type}
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
                    <form className={`measure center`} noValidate autoComplete="off">
                        <fieldset id="basic-add-form" className="ba b--transparent ph0 mh0">
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

                        <Button onClick={props.onItemsClose} color="primary">Close</Button>

                        <Button disabled={props.btnLoading} onClick={props.deleteStore} variant="outlined" color="secondary" className={classes.button} startIcon={<DeleteIcon />} >
                            {props.btnLoading && <CircularProgress size={24} />}
                            {!props.btnLoading && "delete"}
                        </Button>


                        <Button disabled={props.btnLoading} onClick={props.onStoreEdit} variant="contained" color="primary">
                            {props.btnLoading && <CircularProgress size={24} />}
                            {!props.btnLoading && "Update"}
                        </Button>
                    </div>
                </main>
            </div>

        )
    }
}

export default StoreCard;